import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_PLATFORM_DB, RBAC_PERMISSION_MATRIX } from './src/data/seedData.ts';
import {
  fromSupabaseBookingRow,
  supabase,
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  SupabaseBookingRow,
  toSupabaseBookingRow,
  toSupabaseLeadRow,
  toSupabaseOrderRow,
} from './src/lib/supabase.ts';
import {
  BookingRecord,
  CohortStage,
  CrmStage,
  LeadRecord,
  OrderRecord,
  PlatformDatabase,
  StudentCareerProfile,
} from './src/types/platform.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'career360_db.json');

function loadDatabase(): PlatformDatabase {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_PLATFORM_DB, null, 2), 'utf-8');
      return structuredClone(INITIAL_PLATFORM_DB);
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw) as PlatformDatabase;
  } catch {
    return structuredClone(INITIAL_PLATFORM_DB);
  }
}

function saveDatabase(db: PlatformDatabase): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist DB:', err);
  }
}

let db = loadDatabase();

async function syncBookingsWithSupabase(): Promise<{
  tableReady: boolean;
  syncedCount: number;
  message: string;
}> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return {
        tableReady: false,
        syncedCount: 0,
        message: error.message,
      };
    }

    // Merge remote rows into local db
    const remoteRows = (data || []) as SupabaseBookingRow[];
    const remoteMap = new Map<string, BookingRecord>();
    for (const r of remoteRows) {
      remoteMap.set(r.id, fromSupabaseBookingRow(r));
    }

    // Find any local bookings not yet in Supabase and upsert them
    const missingInRemote = db.bookings.filter((b) => !remoteMap.has(b.id));
    if (missingInRemote.length > 0) {
      await supabase
        .from('bookings')
        .upsert(missingInRemote.map(toSupabaseBookingRow), { onConflict: 'id' });
    }

    // Combine unique bookings
    const combinedMap = new Map<string, BookingRecord>();
    for (const b of db.bookings) combinedMap.set(b.id, b);
    for (const [id, b] of remoteMap.entries()) combinedMap.set(id, b);

    db.bookings = Array.from(combinedMap.values());
    saveDatabase(db);

    return {
      tableReady: true,
      syncedCount: db.bookings.length,
      message: `Connected to Supabase (${SUPABASE_PROJECT_ID}). ${db.bookings.length} booking appointments synced.`,
    };
  } catch (err: any) {
    return {
      tableReady: false,
      syncedCount: 0,
      message: err?.message || 'Unable to reach Supabase table',
    };
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '2mb' }));

  // 1. Bootstrap full platform state + check Supabase bookings sync
  app.get('/api/bootstrap', async (_req, res) => {
    const sbStatus = await syncBookingsWithSupabase();
    res.json({
      db,
      rbac: RBAC_PERMISSION_MATRIX,
      supabaseStatus: {
        projectId: SUPABASE_PROJECT_ID,
        url: SUPABASE_URL,
        ...sbStatus,
      },
    });
  });

  // 1b. Explicit Supabase Status & Manual Sync Endpoint
  app.post('/api/supabase/sync-bookings', async (_req, res) => {
    const sbStatus = await syncBookingsWithSupabase();

    // Also attempt syncing leads and orders if tables exist
    if (sbStatus.tableReady) {
      await supabase
        .from('leads')
        .upsert(db.leads.map(toSupabaseLeadRow), { onConflict: 'id' })
        .then(() => undefined, () => undefined);
      await supabase
        .from('orders')
        .upsert(db.orders.map(toSupabaseOrderRow), { onConflict: 'id' })
        .then(() => undefined, () => undefined);
    }

    res.json({
      db,
      supabaseStatus: {
        projectId: SUPABASE_PROJECT_ID,
        url: SUPABASE_URL,
        ...sbStatus,
      },
    });
  });

  // 2. Capture Lead & sync to Supabase + CRM Pipeline
  app.post('/api/leads', async (req, res) => {
    const {
      name,
      mobile,
      email,
      userType = 'Student',
      studentClassOrRole = 'Class 11-12',
      city = 'Mumbai',
      serviceInterested = 'Free Career Assessment',
      preferredContact = 'WhatsApp',
      leadSource = 'Website Lead Form',
    } = req.body || {};

    if (!name || !mobile || !email) {
      res.status(400).json({ error: 'Name, mobile number, and email are required.' });
      return;
    }

    const newLead: LeadRecord = {
      id: `ld-${Date.now()}`,
      name: String(name).trim(),
      mobile: String(mobile).trim(),
      email: String(email).trim(),
      userType,
      studentClassOrRole,
      city: String(city).trim() || 'India',
      serviceInterested,
      preferredContact,
      leadSource,
      leadOwner: userType === 'School/College' ? 'K. Choudhary (Institutional Desk)' : 'Aditi Rao (Senior Career Advisor)',
      leadScore: userType === 'School/College' ? 95 : 88,
      stage: 'New Lead',
      notes: `Captured via ${leadSource}. Interested in ${serviceInterested}. Preferred contact: ${preferredContact}.`,
      followUpDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      createdAt: new Date().toISOString().slice(0, 10),
    };

    db.leads.unshift(newLead);
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      recipientRole: 'Sales/CRM User',
      channel: preferredContact === 'Email' ? 'Email' : 'WhatsApp',
      title: `New ${userType} Lead: ${newLead.name}`,
      message: `${newLead.name} (${newLead.city}) enquired for ${serviceInterested}. Auto-assigned to ${newLead.leadOwner}.`,
      timestamp: 'Just now',
    });

    saveDatabase(db);

    // Sync lead to Supabase
    await supabase
      .from('leads')
      .upsert(toSupabaseLeadRow(newLead), { onConflict: 'id' })
      .then(() => undefined, () => undefined);

    res.status(201).json({ lead: newLead, db });
  });

  // 3. Submit Free Career Assessment & generate Student Career Profile
  app.post('/api/assessments/submit', (req, res) => {
    const {
      userId = 'usr-student-1',
      studentName = 'Aarav Kulkarni',
      cohort = 'Class 11-12',
      academicNotes = '88% Aggregate · Strong interest in future-ready pathways',
      answers = [],
    } = req.body || {};

    const clusterCounts: Record<string, number> = {
      'Technology, AI & Engineering': 0,
      'Finance, Commerce & Management': 0,
      'Healthcare & Life Sciences': 0,
      'Design, Law, Media & Humanities': 0,
    };
    const strengthsSet = new Set<string>();
    let totalScore = 0;

    if (Array.isArray(answers) && answers.length > 0) {
      for (const ans of answers) {
        const cTag = ans.clusterTag || 'Technology, AI & Engineering';
        clusterCounts[cTag] = (clusterCounts[cTag] || 0) + 1;
        if (ans.strengthTag) strengthsSet.add(ans.strengthTag);
        totalScore += Number(ans.score) || 88;
      }
    } else {
      clusterCounts['Technology, AI & Engineering'] = 3;
      clusterCounts['Finance, Commerce & Management'] = 2;
      strengthsSet.add('Systems Thinking & Structured Problem Solving');
      strengthsSet.add('Digital & AI Fluency');
      totalScore = 530;
    }

    const avgScore = Math.min(98, Math.max(72, Math.round(totalScore / Math.max(1, answers.length || 6))));
    const sortedClusters = Object.entries(clusterCounts).sort((a, b) => b[1] - a[1]);
    const primaryCluster = sortedClusters[0]?.[0] || 'Technology, AI & Engineering';
    const secondaryCluster = sortedClusters[1]?.[0] || 'Finance, Commerce & Management';

    const clusterSamples: Record<string, string[]> = {
      'Technology, AI & Engineering': ['AI & Machine Learning Engineer', 'Full-Stack Software Architect', 'Robotics & Data Engineer'],
      'Finance, Commerce & Management': ['Chartered Financial Analyst & FinTech Strategist', 'Technology Product Manager', 'Venture & Strategy Consultant'],
      'Healthcare & Life Sciences': ['Clinical Medicine & Digital Health Specialist', 'Biomedical & Genomics Researcher', 'Health Informatics Lead'],
      'Design, Law, Media & Humanities': ['UX / Product & Interaction Designer', 'Corporate, Technology & IP Lawyer', 'Public Policy & Digital Media Strategist'],
    };

    const newProfile: StudentCareerProfile = {
      id: `prof-${Date.now()}`,
      userId,
      studentName,
      cohort: cohort as CohortStage,
      completedAt: new Date().toISOString().slice(0, 10),
      academicSnapshot: `${cohort} · ${academicNotes}`,
      overallReadinessIndex: avgScore,
      dimensionScores: [
        {
          dimension: 'Analytical & Problem-Solving Aptitude',
          score: Math.min(97, avgScore + 4),
          interpretation: 'High structured reasoning and clarity when breaking down multi-step problems.',
        },
        {
          dimension: 'Domain Curiosity & Intrinsic Interest',
          score: Math.min(96, avgScore + 2),
          interpretation: `Strong natural alignment with ${primaryCluster}.`,
        },
        {
          dimension: 'Technology & AI Readiness',
          score: Math.min(95, avgScore + 1),
          interpretation: 'Proactive inclination toward modern digital tools and AI-augmented workflows.',
        },
        {
          dimension: 'Communication & Presentation Confidence',
          score: Math.max(74, avgScore - 7),
          interpretation: 'Clear conceptual understanding; structured public speaking labs will further amplify impact.',
        },
        {
          dimension: 'Financial & Entrepreneurial Awareness',
          score: Math.max(76, avgScore - 4),
          interpretation: 'Solid awareness of real-world value creation and return on educational investment.',
        },
      ],
      interestAreas: [primaryCluster, secondaryCluster, 'Applied AI & Future Skills', 'Entrepreneurial Problem Solving'],
      strengths: Array.from(strengthsSet).slice(0, 4),
      developmentAreas: [
        'Executive Public Speaking & Persuasive Storytelling',
        'Time-Boxed Competitive Exam & Portfolio Pacing',
        'Practical Financial & Career ROI Modeling',
      ],
      personalityIndicators: ['Analytical-Builder', 'Future-Oriented Learner', 'Outcome-Driven Collaborator'],
      skillIndicators: [
        'Logical & Systems Thinking (Strong)',
        'Digital & AI Literacy (Developing-Strong)',
        'Structured Communication & Interview Readiness (Recommended Focus)',
      ],
      suggestedClusters: [
        {
          clusterName: primaryCluster,
          fitLevel: 'Suggested High Fit',
          rationale: `Primary psychometric convergence across aptitude, interest, and 5-year career preference for ${cohort}.`,
          sampleCareers: clusterSamples[primaryCluster] || clusterSamples['Technology, AI & Engineering'],
        },
        {
          clusterName: secondaryCluster,
          fitLevel: 'Potential Fit',
          rationale: 'Strong secondary competency offering high-leverage interdisciplinary career combinations.',
          sampleCareers: clusterSamples[secondaryCluster] || clusterSamples['Finance, Commerce & Management'],
        },
        {
          clusterName: 'Interdisciplinary Innovation & Entrepreneurship',
          fitLevel: 'Recommended for Exploration',
          rationale: 'Combines domain depth with commercial execution for future leadership or venture building.',
          sampleCareers: ['Technology Product Manager', 'UX / Product & Interaction Designer'],
        },
      ],
      recommendedNextSteps: [
        `Review your ${cohort} Career Profile with a certified Career360 Counsellor to validate stream, degree, or pivot choices.`,
        'Compare your top 2 career pathways side-by-side in the Career Intelligence Database.',
        'Enroll in a foundational Skill Development course to close communication or technical skill gaps early.',
      ],
      ninetyDayActionPlan: [
        {
          phase: 'Days 1–30: Clarity & Validation',
          milestone: `Complete 1-on-1 Counsellor Validation for ${primaryCluster}`,
          outcome: 'Locked academic/career roadmap with parent or mentor alignment.',
        },
        {
          phase: 'Days 31–60: Skill & Portfolio Building',
          milestone: 'Complete 1 Applied Skill Course & Build a Tangible Capstone Project',
          outcome: 'Demonstrable proof-of-work and measurable confidence boost.',
        },
        {
          phase: 'Days 61–90: College / Career Execution',
          milestone: 'Shortlist Top 10 Target Colleges or Roles & Execute Preparation Calendar',
          outcome: 'Structured weekly execution with quarterly milestone tracking.',
        },
      ],
      parentGuidanceNote: `Encourage exploration within ${primaryCluster} and ${secondaryCluster} through hands-on projects and counsellor guidance rather than peer-driven exam pressure.`,
      disclaimer:
        'Automated assessment results indicate suggested areas of potential fit for exploration and further evaluation. They are not guaranteed career or salary decisions.',
    };

    db.profiles.unshift(newProfile);
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      recipientRole: 'Student',
      channel: 'In-App',
      title: `Career Profile Generated (${cohort})`,
      message: `${studentName}'s 14-dimension Career Profile is ready. Primary suggested cluster: ${primaryCluster}.`,
      timestamp: 'Just now',
    });

    saveDatabase(db);
    res.status(201).json({ profile: newProfile, db });
  });

  // 4. Checkout & Payment Engine (Reports, Courses, Counselling) + Supabase Sync
  app.post('/api/orders/checkout', async (req, res) => {
    const {
      userId = 'usr-student-1',
      userName = 'Aarav Kulkarni',
      productType = 'Report',
      productId,
      productName,
      amountInr = 999,
      paymentMethod = 'UPI',
      couponCode = '',
    } = req.body || {};

    if (!productId || !productName) {
      res.status(400).json({ error: 'Product ID and Product Name are required.' });
      return;
    }

    const normalizedCoupon = String(couponCode).trim().toUpperCase();
    let discountRate = 0;
    if (normalizedCoupon === 'FUTURE20') discountRate = 0.2;
    else if (normalizedCoupon === 'BYTEZEN10') discountRate = 0.1;

    const gross = Number(amountInr) || 0;
    const discountInr = Math.round(gross * discountRate);
    const totalPaidInr = Math.max(0, gross - discountInr);
    const baseAmount = Math.round(totalPaidInr / 1.18);
    const gstInr = totalPaidInr - baseAmount;

    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      userId,
      userName,
      productType,
      productId,
      productName,
      amountInr: baseAmount,
      gstInr,
      discountInr,
      totalPaidInr,
      paymentMethod,
      couponApplied: discountRate > 0 ? normalizedCoupon : undefined,
      invoiceNumber: `BZ-C360-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Paid',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    db.orders.unshift(newOrder);

    const user = db.users.find((u) => u.id === userId) || db.users[0];
    if (user) {
      if (productType === 'Report' && !user.unlockedReportIds.includes(productId)) {
        user.unlockedReportIds.push(productId);
      }
      if (productType === 'Skill Course' && !user.enrolledCourseIds.includes(productId)) {
        user.enrolledCourseIds.push(productId);
      }
    }

    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      recipientRole: 'ALL',
      channel: 'Email',
      title: `Payment Confirmed: ${productName}`,
      message: `GST Invoice ${newOrder.invoiceNumber} for ₹${totalPaidInr} via ${paymentMethod}. Product unlocked immediately.`,
      timestamp: 'Just now',
    });

    saveDatabase(db);

    await supabase
      .from('orders')
      .upsert(toSupabaseOrderRow(newOrder), { onConflict: 'id' })
      .then(() => undefined, () => undefined);

    res.status(201).json({ order: newOrder, db });
  });

  // 5. Appointment Booking Engine — Saves directly to Supabase `bookings` table
  app.post('/api/bookings', async (req, res) => {
    const {
      studentId = 'usr-student-1',
      studentName = 'Aarav Kulkarni',
      studentCohort = 'Class 11-12',
      counsellorId,
      serviceTitle = '1-on-1 Career Clarity & Roadmap Session',
      date,
      slot,
      mode = 'Online Video',
      notes = '',
    } = req.body || {};

    const counsellor = db.counsellors.find((c) => c.id === counsellorId) || db.counsellors[0];
    if (!counsellor || !date || !slot) {
      res.status(400).json({ error: 'Counsellor, date, and slot are required.' });
      return;
    }

    const bookingId = `bk-${Date.now()}`;
    const newBooking: BookingRecord = {
      id: bookingId,
      studentId,
      studentName,
      studentCohort,
      counsellorId: counsellor.id,
      counsellorName: counsellor.name,
      serviceTitle,
      date,
      slot,
      mode,
      feePaidInr: counsellor.feeInr,
      status: 'Confirmed',
      meetingLink: `https://meet.bytezenit.com/career360-${bookingId}`,
      notes,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    db.bookings.unshift(newBooking);
    counsellor.sessionsCompleted += 1;

    const totalPaidInr = counsellor.feeInr;
    const baseAmount = Math.round(totalPaidInr / 1.18);
    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      userId: studentId,
      userName: studentName,
      productType: 'Counselling',
      productId: counsellor.id,
      productName: `${serviceTitle} with ${counsellor.name}`,
      amountInr: baseAmount,
      gstInr: totalPaidInr - baseAmount,
      discountInr: 0,
      totalPaidInr,
      paymentMethod: 'UPI',
      invoiceNumber: `BZ-C360-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Paid',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    db.orders.unshift(newOrder);

    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      recipientRole: 'Student',
      channel: 'WhatsApp',
      title: `Session Confirmed with ${counsellor.name}`,
      message: `Booked for ${date} at ${slot} (${mode}). Saved to Supabase & meeting link generated.`,
      timestamp: 'Just now',
    });

    saveDatabase(db);

    // Persist appointment booking directly to user's Supabase project (xvnijylejrfrhdrezyek)
    const { error: sbError } = await supabase
      .from('bookings')
      .upsert(toSupabaseBookingRow(newBooking), { onConflict: 'id' });

    await supabase
      .from('orders')
      .upsert(toSupabaseOrderRow(newOrder), { onConflict: 'id' })
      .then(() => undefined, () => undefined);

    res.status(201).json({
      booking: newBooking,
      supabaseSynced: !sbError,
      supabaseError: sbError ? sbError.message : null,
      db,
    });
  });

  // 6. Update Counsellor Availability & Fee (Phase 7)
  app.patch('/api/counsellors/:id/availability', (req, res) => {
    const counsellor = db.counsellors.find((c) => c.id === req.params.id);
    if (!counsellor) {
      res.status(404).json({ error: 'Counsellor not found' });
      return;
    }
    const { feeInr, availableDays, availableSlots, sessionDurationMins, bufferMins } = req.body || {};
    if (feeInr !== undefined) counsellor.feeInr = Number(feeInr);
    if (Array.isArray(availableDays)) counsellor.availableDays = availableDays;
    if (Array.isArray(availableSlots)) counsellor.availableSlots = availableSlots;
    if (sessionDurationMins !== undefined) counsellor.sessionDurationMins = Number(sessionDurationMins);
    if (bufferMins !== undefined) counsellor.bufferMins = Number(bufferMins);

    saveDatabase(db);
    res.json({ counsellor, db });
  });

  // 7. Update CRM Lead Stage (Phase 15)
  app.patch('/api/crm/leads/:id', async (req, res) => {
    const lead = db.leads.find((l) => l.id === req.params.id);
    if (!lead) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }
    const { stage, notes, leadScore } = req.body || {};
    if (stage) lead.stage = stage as CrmStage;
    if (notes !== undefined) lead.notes = String(notes);
    if (leadScore !== undefined) lead.leadScore = Number(leadScore);

    saveDatabase(db);

    await supabase
      .from('leads')
      .upsert(toSupabaseLeadRow(lead), { onConflict: 'id' })
      .then(() => undefined, () => undefined);

    res.json({ lead, db });
  });

  // 8. Toggle Save Career for Student/User
  app.post('/api/users/save-career', (req, res) => {
    const { userId = 'usr-student-1', careerId } = req.body || {};
    const user = db.users.find((u) => u.id === userId) || db.users[0];
    if (user && careerId) {
      const idx = user.savedCareerIds.indexOf(careerId);
      if (idx >= 0) {
        user.savedCareerIds.splice(idx, 1);
      } else {
        user.savedCareerIds.push(careerId);
      }
      saveDatabase(db);
    }
    res.json({ db });
  });

  // 9. Admin CMS Creation (Phase 17 & 18)
  app.post('/api/cms/career', (req, res) => {
    const {
      name,
      category = 'Emerging Careers',
      description,
      eligibility = 'Class 12 Any Stream / Domain Aptitude',
      entrySalaryInr = '₹7.5L – ₹15L PA',
      midCareerSalaryInr = '₹18L – ₹35L PA',
      seniorSalaryInr = '₹40L – ₹80L+ PA',
      coreSkills = ['Domain Analysis', 'AI Workflows', 'Strategic Communication'],
      entranceExams = ['CUET', 'Institute Specific Aptitude Test'],
      topColleges = ['IITs / IIMs / Premier Universities'],
    } = req.body || {};

    if (!name || !description) {
      res.status(400).json({ error: 'Career name and description are required.' });
      return;
    }

    const newCareer = {
      id: `car-${Date.now()}`,
      name,
      category,
      description,
      eligibility,
      educationPathway: ['Bachelor Degree in Domain', 'Industry Specialization / Master Certification'],
      requiredSubjects: ['English', 'Domain Electives'],
      coreSkills: Array.isArray(coreSkills) ? coreSkills : String(coreSkills).split(',').map((s) => s.trim()),
      certifications: ['Career360 Industry Readiness Certificate'],
      entranceExams: Array.isArray(entranceExams) ? entranceExams : String(entranceExams).split(',').map((s) => s.trim()),
      topCourses: ['Undergraduate Honours', 'Applied Specialization'],
      topColleges: Array.isArray(topColleges) ? topColleges : String(topColleges).split(',').map((s) => s.trim()),
      jobRoles: [name, `Senior ${name}`, 'Domain Consultant'],
      industries: ['Technology', 'Enterprise Consulting', 'Emerging Sectors'],
      entrySalaryInr,
      midCareerSalaryInr,
      seniorSalaryInr,
      studyDurationYears: '3–4 Years',
      avgEducationCostInr: '₹6L – ₹15L Total',
      competitionLevel: 'Moderate' as const,
      futureOutlook: 'Strong multi-decade expansion driven by digital transformation.',
      aiImpact: 'AI augments productivity while human domain synthesis remains primary.',
      automationRisk: 'Low (Human-Centric / Strategic)' as const,
      entrepreneurshipOpportunities: 'High potential for specialized consulting and vertical SaaS/agency creation.',
      freelancingOpportunities: 'Global remote project consulting and advisory.',
    };

    db.careers.unshift(newCareer);
    saveDatabase(db);
    res.status(201).json({ career: newCareer, db });
  });

  // 10. Phase 16 — Server-Side AI Career Engine (@google/genai)
  app.post('/api/ai/career-advisor', async (req, res) => {
    const {
      cohort = 'Class 11-12',
      currentSkillsOrSubjects = 'PCM, Python, Analytical Problem Solving',
      interests = 'AI, FinTech, Product Building',
      goalType = 'Job vs Entrepreneurship & 5-Year Roadmap',
      customQuestion = '',
    } = req.body || {};

    const apiKey = process.env.GEMINI_API_KEY;
    const hasRealKey = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 10);

    if (hasRealKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const promptText = `You are the Career360 AI Career Engine by Bytezen IT Solution.
Analyze the following Indian student/professional profile and provide structured, non-guaranteed career guidance:
- Cohort / Stage: ${cohort}
- Current Subjects / Skills: ${currentSkillsOrSubjects}
- Interests: ${interests}
- Primary Focus: ${goalType}
- Specific Question: ${customQuestion || 'Provide a comprehensive career cluster recommendation, skill-gap analysis, job-vs-business evaluation, and 90-day roadmap.'}

Remember: Use phrases like "Suggested fit", "Potential pathway", and "Recommended for further evaluation with a certified counsellor". Never guarantee admissions or salaries.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptText,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                executiveInterpretation: { type: Type.STRING },
                recommendedPathways: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      fitIndicator: { type: Type.STRING },
                      whyItFits: { type: Type.STRING },
                      targetCollegesOrExams: { type: Type.STRING },
                    },
                    required: ['title', 'fitIndicator', 'whyItFits', 'targetCollegesOrExams'],
                  },
                },
                skillGapAnalysis: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      skill: { type: Type.STRING },
                      currentLevel: { type: Type.STRING },
                      recommendedAction: { type: Type.STRING },
                    },
                    required: ['skill', 'currentLevel', 'recommendedAction'],
                  },
                },
                jobVsBusinessGuidance: { type: Type.STRING },
                ninetyDayRoadmap: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                counsellorValidationNote: { type: Type.STRING },
              },
              required: [
                'executiveInterpretation',
                'recommendedPathways',
                'skillGapAnalysis',
                'jobVsBusinessGuidance',
                'ninetyDayRoadmap',
                'counsellorValidationNote',
              ],
            },
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        res.json({ source: 'gemini-3.8-flash', analysis: parsed });
        return;
      } catch (err) {
        console.warn('Gemini call fell back to structured Career360 engine:', err);
      }
    }

    res.json({
      source: 'career360-structured-engine',
      analysis: {
        executiveInterpretation: `Based on your ${cohort} profile (${currentSkillsOrSubjects}) and interest in ${interests}, your profile shows strong convergence between quantitative problem-solving and modern digital product creation. We recommend evaluating high-leverage interdisciplinary pathways that combine core technical/domain rigor with communication and commercial literacy.`,
        recommendedPathways: [
          {
            title: 'Applied AI, Data Science & Computational Systems',
            fitIndicator: 'Suggested High Fit (92% Alignment)',
            whyItFits: `Directly leverages your background in ${currentSkillsOrSubjects} while aligning with high-growth AI & product engineering roles.`,
            targetCollegesOrExams: 'JEE Main / IIIT-H UGEE / BITSAT / IIT Madras BS Data Science',
          },
          {
            title: 'Technology Product Management & FinTech Strategy',
            fitIndicator: 'Potential Fit (87% Alignment)',
            whyItFits: `Bridges your interest in ${interests} with commercial leadership, product strategy, and algorithmic decision-making.`,
            targetCollegesOrExams: 'IPMAT (IIM Indore/Rohtak) / CUET (SSCBS) / CAT / Product Fellowship',
          },
          {
            title: 'Human-AI Interaction & Product Design',
            fitIndicator: 'Recommended for Exploration (82% Alignment)',
            whyItFits: 'High-impact pathway for builders who enjoy translating complex technology into intuitive user experiences.',
            targetCollegesOrExams: 'UCEED (IIT Bombay/Guwahati) / NID DAT / Portfolio Entry',
          },
        ],
        skillGapAnalysis: [
          {
            skill: 'Applied AI & Prompt Workflow Engineering',
            currentLevel: 'Foundational',
            recommendedAction: 'Complete Career360 Applied Generative AI Lab & build 2 documented GitHub/portfolio projects.',
          },
          {
            skill: 'Executive Articulation & Persuasive Pitching',
            currentLevel: 'Developing',
            recommendedAction: 'Practice structured Pyramid-Principle speaking for interviews, GDs, and stakeholder reviews.',
          },
          {
            skill: 'Financial & Unit-Economics Literacy',
            currentLevel: 'Beginner-Intermediate',
            recommendedAction: 'Master ROI calculation, capital allocation basics, and business model analysis.',
          },
        ],
        jobVsBusinessGuidance: `For ${cohort} focusing on "${goalType}": Start by building deep domain credibility and high-leverage technical/commercial skills (Years 1–3) while validating micro-ventures or side projects. Once you have proven problem-solving distribution, transition into a scalable startup or consulting practice.`,
        ninetyDayRoadmap: [
          'Days 1–30: Lock primary & backup academic/career tracks and validate with a certified Career360 counsellor.',
          'Days 31–60: Complete one hands-on skill capstone (Applied AI or Communication) to build verifiable proof of work.',
          'Days 61–90: Finalize entrance exam / college / role shortlist and review Education ROI with family.',
        ],
        counsellorValidationNote:
          'Guidance Notice: AI-generated insights represent suggested directions for exploration based on your inputs and are not guaranteed outcomes. Please validate your final roadmap with a certified Career360 counsellor.',
      },
    });
  });

  // 11. Phase 20 — Mobile Application Readiness Manifest & Token REST Contract
  app.get('/api/mobile/v1/manifest', (_req, res) => {
    res.json({
      platform: 'Career360 by Bytezen IT Solution',
      version: '2.0.0-phase20',
      authArchitecture: 'Bearer JWT + Mobile OTP + Google OAuth 2.0',
      supabaseProjectId: SUPABASE_PROJECT_ID,
      offlineSyncSupported: true,
      pushNotificationChannels: ['FCM_ANDROID', 'APNS_IOS', 'WHATSAPP_CLOUD_API', 'EMAIL_SMTP'],
      endpoints: [
        'GET /api/bootstrap',
        'POST /api/leads',
        'POST /api/assessments/submit',
        'POST /api/orders/checkout',
        'POST /api/bookings',
        'PATCH /api/counsellors/:id/availability',
        'PATCH /api/crm/leads/:id',
        'POST /api/cms/career',
        'POST /api/ai/career-advisor',
      ],
      counts: {
        careers: db.careers.length,
        colleges: db.colleges.length,
        courses: db.courses.length,
        counsellors: db.counsellors.length,
        bookings: db.bookings.length,
        orders: db.orders.length,
        leads: db.leads.length,
      },
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Career360 by Bytezen IT Solution server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
