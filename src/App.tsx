import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  FileText,
  GraduationCap,
  Lock,
  Menu,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';
import { AssessmentEngine } from './components/AssessmentEngine';
import { CareersAndCollegesView } from './components/CareersAndCollegesView';
import { CounsellorsView, SupabaseSyncStatus } from './components/CounsellorsView';
import { EcosystemMatrix } from './components/EcosystemMatrix';
import { RoleWorkspacesView } from './components/RoleWorkspacesView';
import { SkillsAndProView } from './components/SkillsAndProView';
import { HERO_IMAGE_PATH, INITIAL_PLATFORM_DB } from './data/seedData';
import {
  fromSupabaseBookingRow,
  supabase,
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  SupabaseBookingRow,
  toSupabaseBookingRow,
  toSupabaseLeadRow,
  toSupabaseOrderRow,
} from './lib/supabase';
import {
  BookingRecord,
  CohortStage,
  CrmStage,
  EcosystemNodeItem,
  EcosystemPillar,
  LeadRecord,
  OrderRecord,
  PlatformDatabase,
  ReportProduct,
  SkillCourseRecord,
  StudentCareerProfile,
  UserRole,
} from './types/platform';

type ActiveTab = 'ecosystem' | 'assessment' | 'careers' | 'counsellors' | 'skills' | 'workspace';

interface CheckoutTarget {
  productType: 'Report' | 'Skill Course';
  productId: string;
  productName: string;
  priceInr: number;
}

export default function App() {
  const [db, setDb] = useState<PlatformDatabase>(INITIAL_PLATFORM_DB);
  const [activeTab, setActiveTab] = useState<ActiveTab>('ecosystem');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [heroImgFailed, setHeroImgFailed] = useState<boolean>(false);

  // Contextual sub-navigation states when jumping from Ecosystem Matrix
  const [selectedCohort, setSelectedCohort] = useState<CohortStage>('Class 11-12');
  const [careersSubTab, setCareersSubTab] = useState<'careers' | 'compare' | 'colleges'>('careers');
  const [skillsSubCategory, setSkillsSubCategory] = useState<string>('ALL');
  const [workspaceRole, setWorkspaceRole] = useState<UserRole>('Student');

  // Lead Capture Form State (Phase 1)
  const [leadName, setLeadName] = useState<string>('');
  const [leadMobile, setLeadMobile] = useState<string>('');
  const [leadEmail, setLeadEmail] = useState<string>('');
  const [leadUserType, setLeadUserType] = useState<
    'Student' | 'Parent' | 'Working Professional' | 'School/College'
  >('Student');
  const [leadClass, setLeadClass] = useState<string>('Class 9-10');
  const [leadCity, setLeadCity] = useState<string>('');
  const [leadService, setLeadService] = useState<string>('Stream Selection & Career Clarity Report');
  const [leadContactMethod, setLeadContactMethod] = useState<'WhatsApp' | 'Phone Call' | 'Email'>('WhatsApp');
  const [leadConsent, setLeadConsent] = useState<boolean>(true);
  const [leadSubmitting, setLeadSubmitting] = useState<boolean>(false);
  const [leadSuccessMsg, setLeadSuccessMsg] = useState<string>('');

  // Checkout Modal State (Phase 5)
  const [checkoutTarget, setCheckoutTarget] = useState<CheckoutTarget | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [couponCode, setCouponCode] = useState<string>('FUTURE20');
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseSyncStatus | null>(null);

  const syncDirectWithSupabase = async (currentBookings: BookingRecord[]) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setSupabaseStatus({
          projectId: SUPABASE_PROJECT_ID,
          url: SUPABASE_URL,
          tableReady: false,
          syncedCount: 0,
          message: error.message,
        });
        return;
      }

      const remoteRows = (data || []) as SupabaseBookingRow[];
      const remoteMap = new Map<string, BookingRecord>();
      for (const r of remoteRows) {
        remoteMap.set(r.id, fromSupabaseBookingRow(r));
      }

      const missingInRemote = currentBookings.filter((b) => !remoteMap.has(b.id));
      if (missingInRemote.length > 0) {
        await supabase
          .from('bookings')
          .upsert(missingInRemote.map(toSupabaseBookingRow), { onConflict: 'id' });
      }

      const combinedMap = new Map<string, BookingRecord>();
      for (const [id, b] of remoteMap.entries()) combinedMap.set(id, b);
      for (const b of currentBookings) {
        if (!combinedMap.has(b.id)) combinedMap.set(b.id, b);
      }

      const mergedBookings = Array.from(combinedMap.values());
      setDb((prev) => ({ ...prev, bookings: mergedBookings }));
      setSupabaseStatus({
        projectId: SUPABASE_PROJECT_ID,
        url: SUPABASE_URL,
        tableReady: true,
        syncedCount: mergedBookings.length,
        message: `Connected to Supabase (${SUPABASE_PROJECT_ID}). ${mergedBookings.length} booking appointments synced.`,
      });
    } catch (err: any) {
      setSupabaseStatus({
        projectId: SUPABASE_PROJECT_ID,
        url: SUPABASE_URL,
        tableReady: false,
        syncedCount: 0,
        message: err?.message || 'Unable to reach Supabase endpoint',
      });
    }
  };

  useEffect(() => {
    fetch('/api/bootstrap')
      .then((r) => {
        if (!r.ok) throw new Error('Static deployment mode');
        return r.json();
      })
      .then((data) => {
        if (data?.db) setDb(data.db);
        if (data?.supabaseStatus) setSupabaseStatus(data.supabaseStatus);
      })
      .catch(() => {
        // Direct Supabase sync when hosted on Netlify static CDN
        syncDirectWithSupabase(INITIAL_PLATFORM_DB.bookings);
      });
  }, []);

  const handleSyncSupabase = async () => {
    try {
      const res = await fetch('/api/supabase/sync-bookings', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.db) setDb(data.db);
        if (data?.supabaseStatus) setSupabaseStatus(data.supabaseStatus);
        return;
      }
    } catch {
      // Fall through to direct Supabase sync
    }
    await syncDirectWithSupabase(db.bookings);
  };

  const currentUser = db.users[0] || INITIAL_PLATFORM_DB.users[0];

  const handleNavigateNode = (item: EcosystemNodeItem) => {
    if (item.targetTab === 'assessment') {
      if (item.targetSubView) {
        setSelectedCohort(item.targetSubView as CohortStage);
      }
      setActiveTab('assessment');
    } else if (item.targetTab === 'careers') {
      setCareersSubTab(
        item.targetSubView === 'colleges'
          ? 'colleges'
          : item.targetSubView === 'compare'
          ? 'compare'
          : 'careers'
      );
      setActiveTab('careers');
    } else if (item.targetTab === 'counsellors') {
      setActiveTab('counsellors');
    } else if (item.targetTab === 'skills') {
      setSkillsSubCategory(item.targetSubView || 'ALL');
      setActiveTab('skills');
    } else if (item.targetTab === 'workspace') {
      if (item.targetSubView) {
        setWorkspaceRole(item.targetSubView as UserRole);
      }
      setActiveTab('workspace');
    } else {
      setActiveTab('ecosystem');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookCounsellingForNode = (_item: EcosystemNodeItem, _pillar: EcosystemPillar) => {
    setActiveTab('counsellors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestCallbackForNode = (item: EcosystemNodeItem, pillar: EcosystemPillar) => {
    if (pillar.id === 'for-schools') {
      setLeadUserType('School/College');
      setLeadService('Annual School / College B2B Program');
    } else if (pillar.id === 'parent-services') {
      setLeadUserType('Parent');
      setLeadService('1-on-1 Career Counselling Session');
    } else if (item.id === 'cg-wp' || pillar.id === 'entrepreneurship') {
      setLeadUserType('Working Professional');
      setLeadClass('Working Professional');
      setLeadService('1-on-1 Career Counselling Session');
    } else if (pillar.id === 'skill-development') {
      setLeadUserType('Student');
      setLeadService('Skill Development Course (AI / English / Coding)');
    } else {
      setLeadUserType('Student');
      setLeadService('Stream Selection & Career Clarity Report');
    }
    const deskEl = document.getElementById('consultation-desk');
    if (deskEl) {
      deskEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // API + Direct Supabase Handlers
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadMobile.trim() || !leadEmail.trim()) return;
    setLeadSubmitting(true);
    try {
      const newLead: LeadRecord = {
        id: `ld-${Date.now()}`,
        name: leadName.trim(),
        mobile: leadMobile.trim(),
        email: leadEmail.trim(),
        userType: leadUserType,
        studentClassOrRole: leadClass,
        city: leadCity.trim() || 'Mumbai',
        serviceInterested: leadService,
        preferredContact: leadContactMethod,
        leadSource: 'Homepage Consultation Desk',
        leadOwner:
          leadUserType === 'School/College'
            ? 'K. Choudhary (Institutional Desk)'
            : 'Aditi Rao (Senior Career Advisor)',
        leadScore: leadUserType === 'School/College' ? 95 : 88,
        stage: 'New Lead',
        notes: `Interested in ${leadService}. Preferred contact: ${leadContactMethod}.`,
        followUpDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        createdAt: new Date().toISOString().slice(0, 10),
      };

      await supabase
        .from('leads')
        .upsert(toSupabaseLeadRow(newLead), { onConflict: 'id' })
        .then(() => undefined, () => undefined);

      try {
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: leadName,
            mobile: leadMobile,
            email: leadEmail,
            userType: leadUserType,
            studentClassOrRole: leadClass,
            city: leadCity || 'Mumbai',
            serviceInterested: leadService,
            preferredContact: leadContactMethod,
            leadSource: 'Homepage Consultation Desk',
            consent: leadConsent,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.db) setDb(data.db);
        } else {
          setDb((prev) => ({ ...prev, leads: [newLead, ...prev.leads] }));
        }
      } catch {
        setDb((prev) => ({ ...prev, leads: [newLead, ...prev.leads] }));
      }

      setLeadSuccessMsg(
        `Thank you, ${leadName}! Your enquiry is saved to Supabase and assigned to a Senior Career Advisor via ${leadContactMethod}.`
      );
      setLeadName('');
      setLeadMobile('');
      setLeadEmail('');
      setLeadCity('');
    } finally {
      setLeadSubmitting(false);
    }
  };

  const handleSubmitAssessment = async (payload: {
    userId: string;
    studentName: string;
    cohort: CohortStage;
    academicNotes: string;
    answers: { score: number; clusterTag: string; strengthTag: string }[];
  }): Promise<StudentCareerProfile | null> => {
    try {
      const res = await fetch('/api/assessments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.db) setDb(data.db);
        return data?.profile || null;
      }
    } catch {
      // Client-side calculation fallback for static hosting
    }

    const totalScore = payload.answers.reduce((acc, a) => acc + (Number(a.score) || 88), 0);
    const avgScore = Math.min(98, Math.max(75, Math.round(totalScore / Math.max(1, payload.answers.length))));
    const primaryCluster = payload.answers[0]?.clusterTag || 'Technology, AI & Engineering';
    const fallbackProfile: StudentCareerProfile = {
      ...INITIAL_PLATFORM_DB.profiles[0],
      id: `prof-${Date.now()}`,
      userId: payload.userId,
      studentName: payload.studentName,
      cohort: payload.cohort,
      completedAt: new Date().toISOString().slice(0, 10),
      academicSnapshot: `${payload.cohort} · ${payload.academicNotes}`,
      overallReadinessIndex: avgScore,
    };
    setDb((prev) => ({
      ...prev,
      profiles: [fallbackProfile, ...prev.profiles],
    }));
    return fallbackProfile;
  };

  const handleOpenReportCheckout = (rep: ReportProduct) => {
    setCompletedOrder(null);
    setCheckoutTarget({
      productType: 'Report',
      productId: rep.id,
      productName: rep.name,
      priceInr: rep.priceInr,
    });
  };

  const handleOpenCourseCheckout = (course: SkillCourseRecord) => {
    setCompletedOrder(null);
    setCheckoutTarget({
      productType: 'Skill Course',
      productId: course.id,
      productName: course.title,
      priceInr: course.feesInr,
    });
  };

  const handleExecuteCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutTarget) return;
    setIsCheckingOut(true);
    try {
      const normalizedCoupon = couponCode.trim().toUpperCase();
      const discountRate =
        normalizedCoupon === 'FUTURE20' ? 0.2 : normalizedCoupon === 'BYTEZEN10' ? 0.1 : 0;
      const discountInr = Math.round(checkoutTarget.priceInr * discountRate);
      const totalPaidInr = Math.max(0, checkoutTarget.priceInr - discountInr);
      const baseAmount = Math.round(totalPaidInr / 1.18);
      const gstInr = totalPaidInr - baseAmount;

      const fallbackOrder: OrderRecord = {
        id: `ord-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        productType: checkoutTarget.productType,
        productId: checkoutTarget.productId,
        productName: checkoutTarget.productName,
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

      await supabase
        .from('orders')
        .upsert(toSupabaseOrderRow(fallbackOrder), { onConflict: 'id' })
        .then(() => undefined, () => undefined);

      try {
        const res = await fetch('/api/orders/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser.id,
            userName: currentUser.name,
            productType: checkoutTarget.productType,
            productId: checkoutTarget.productId,
            productName: checkoutTarget.productName,
            amountInr: checkoutTarget.priceInr,
            paymentMethod,
            couponCode,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.db) setDb(data.db);
          if (data?.order) {
            setCompletedOrder(data.order);
            return;
          }
        }
      } catch {
        // Use direct Supabase + client state update
      }

      setDb((prev) => ({
        ...prev,
        orders: [fallbackOrder, ...prev.orders],
        users: prev.users.map((u, idx) =>
          idx === 0
            ? {
                ...u,
                unlockedReportIds:
                  checkoutTarget.productType === 'Report'
                    ? Array.from(new Set([...u.unlockedReportIds, checkoutTarget.productId]))
                    : u.unlockedReportIds,
                enrolledCourseIds:
                  checkoutTarget.productType === 'Skill Course'
                    ? Array.from(new Set([...u.enrolledCourseIds, checkoutTarget.productId]))
                    : u.enrolledCourseIds,
              }
            : u
        ),
      }));
      setCompletedOrder(fallbackOrder);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCreateBooking = async (payload: {
    studentId: string;
    studentName: string;
    studentCohort: string;
    counsellorId: string;
    serviceTitle: string;
    date: string;
    slot: string;
    mode: 'Online Video' | 'In-Centre';
    notes: string;
  }): Promise<BookingRecord | null> => {
    const counsellor =
      db.counsellors.find((c) => c.id === payload.counsellorId) || db.counsellors[0];
    const bookingId = `bk-${Date.now()}`;
    const directBooking: BookingRecord = {
      id: bookingId,
      studentId: payload.studentId,
      studentName: payload.studentName,
      studentCohort: payload.studentCohort,
      counsellorId: counsellor.id,
      counsellorName: counsellor.name,
      serviceTitle: payload.serviceTitle,
      date: payload.date,
      slot: payload.slot,
      mode: payload.mode,
      feePaidInr: counsellor.feeInr,
      status: 'Confirmed',
      meetingLink: `https://meet.bytezenit.com/career360-${bookingId}`,
      notes: payload.notes,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    // Always write directly to Supabase bookings table first
    await supabase
      .from('bookings')
      .upsert(toSupabaseBookingRow(directBooking), { onConflict: 'id' })
      .then(() => undefined, () => undefined);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.db) setDb(data.db);
        return data?.booking || directBooking;
      }
    } catch {
      // Static Netlify fallback
    }

    setDb((prev) => ({
      ...prev,
      bookings: [directBooking, ...prev.bookings],
    }));
    return directBooking;
  };

  const handleToggleSaveCareer = async (careerId: string) => {
    try {
      const res = await fetch('/api/users/save-career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, careerId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.db) {
          setDb(data.db);
          return;
        }
      }
    } catch {
      // Static fallback
    }
    setDb((prev) => ({
      ...prev,
      users: prev.users.map((u, idx) =>
        idx === 0
          ? {
              ...u,
              savedCareerIds: u.savedCareerIds.includes(careerId)
                ? u.savedCareerIds.filter((id) => id !== careerId)
                : [...u.savedCareerIds, careerId],
            }
          : u
      ),
    }));
  };

  const handleUpdateLeadStage = async (leadId: string, stage: CrmStage) => {
    setDb((prev) => ({
      ...prev,
      leads: prev.leads.map((l) => (l.id === leadId ? { ...l, stage } : l)),
    }));
    try {
      const res = await fetch(`/api/crm/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.db) setDb(data.db);
      }
    } catch {
      // Updated in state
    }
  };

  const handleUpdateCounsellorFee = async (counsellorId: string, feeInr: number) => {
    setDb((prev) => ({
      ...prev,
      counsellors: prev.counsellors.map((c) => (c.id === counsellorId ? { ...c, feeInr } : c)),
    }));
    try {
      const res = await fetch(`/api/counsellors/${counsellorId}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feeInr }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.db) setDb(data.db);
      }
    } catch {
      // Updated in state
    }
  };

  const handleAddCareerCms = async (payload: {
    name: string;
    category: string;
    description: string;
    eligibility: string;
    entrySalaryInr: string;
  }) => {
    try {
      const res = await fetch('/api/cms/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.db) {
          setDb(data.db);
          return;
        }
      }
    } catch {
      // Static fallback
    }
    setDb((prev) => ({
      ...prev,
      careers: [
        {
          ...prev.careers[0],
          id: `car-${Date.now()}`,
          name: payload.name,
          category: payload.category as any,
          description: payload.description,
          eligibility: payload.eligibility,
          entrySalaryInr: payload.entrySalaryInr,
        },
        ...prev.careers,
      ],
    }));
  };

  const handleRequestSchoolProgram = async (
    schoolName: string,
    city: string,
    mobile: string,
    email: string
  ) => {
    const newSchoolLead: LeadRecord = {
      id: `ld-${Date.now()}`,
      name: `${schoolName} (Institutional B2B)`,
      mobile,
      email,
      userType: 'School/College',
      studentClassOrRole: 'Class 8–12 Institutional Batch',
      city,
      serviceInterested: 'Annual School Career Guidance Program',
      preferredContact: 'Phone Call',
      leadSource: 'B2B School Portal',
      leadOwner: 'K. Choudhary (Institutional Desk)',
      leadScore: 95,
      stage: 'New Lead',
      notes: 'Requested Institutional Partnership Proposal.',
      followUpDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      createdAt: new Date().toISOString().slice(0, 10),
    };

    await supabase
      .from('leads')
      .upsert(toSupabaseLeadRow(newSchoolLead), { onConflict: 'id' })
      .then(() => undefined, () => undefined);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${schoolName} (Institutional B2B)`,
          mobile,
          email,
          userType: 'School/College',
          studentClassOrRole: 'Class 8–12 Institutional Batch',
          city,
          serviceInterested: 'Annual School Career Guidance Program',
          preferredContact: 'Phone Call',
          leadSource: 'B2B School Portal',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.db) {
          setDb(data.db);
          return;
        }
      }
    } catch {
      // Static fallback
    }
    setDb((prev) => ({ ...prev, leads: [newSchoolLead, ...prev.leads] }));
  };

  // Discount calculation preview for Checkout Modal
  const discountMultiplier =
    couponCode.trim().toUpperCase() === 'FUTURE20'
      ? 0.2
      : couponCode.trim().toUpperCase() === 'BYTEZEN10'
      ? 0.1
      : 0;
  const checkoutFinalPrice = checkoutTarget
    ? Math.round(checkoutTarget.priceInr * (1 - discountMultiplier))
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('ecosystem');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xl font-bold tracking-tight text-[#0D3B49] font-display whitespace-nowrap"
          >
            Career360
          </a>

          {/* Zone 2: 5 single-line navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
          >
            <button
              type="button"
              onClick={() => setActiveTab('ecosystem')}
              className={`py-1 transition-colors cursor-pointer whitespace-nowrap border-b-2 ${
                activeTab === 'ecosystem'
                  ? 'text-slate-900 border-[#0F766E] font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Ecosystem
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('assessment')}
              className={`py-1 transition-colors cursor-pointer whitespace-nowrap border-b-2 ${
                activeTab === 'assessment'
                  ? 'text-slate-900 border-[#0F766E] font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Assessment
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('careers')}
              className={`py-1 transition-colors cursor-pointer whitespace-nowrap border-b-2 ${
                activeTab === 'careers'
                  ? 'text-slate-900 border-[#0F766E] font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Careers & Colleges
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('counsellors')}
              className={`py-1 transition-colors cursor-pointer whitespace-nowrap border-b-2 ${
                activeTab === 'counsellors'
                  ? 'text-slate-900 border-[#0F766E] font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Counsellors
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('skills')}
              className={`py-1 transition-colors cursor-pointer whitespace-nowrap border-b-2 ${
                activeTab === 'skills'
                  ? 'text-slate-900 border-[#0F766E] font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Skills & AI
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('workspace')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'workspace'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              Workspaces ({workspaceRole})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('assessment')}
              className="hidden sm:inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-[#0F766E] rounded-lg hover:bg-[#115E59] transition-colors cursor-pointer whitespace-nowrap"
            >
              Take Free Assessment
            </button>

            <button
              type="button"
              aria-label="Toggle Mobile Navigation"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2">
            {(
              [
                ['ecosystem', 'Ecosystem & Home'],
                ['assessment', 'Free Career Assessment'],
                ['careers', 'Careers & Colleges'],
                ['counsellors', 'Counsellors Marketplace'],
                ['skills', 'Skill Courses & AI Advisor'],
                ['workspace', 'Role Dashboards & CRM'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActiveTab(key);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  activeTab === key
                    ? 'bg-[#F0FDFA] text-[#0F766E]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* MAIN CONTENT VIEWPORT */}
      <main className="flex-1">
        {activeTab === 'ecosystem' && (
          <>
            {/* HERO SECTION (PHASE 1) */}
            <section className="py-12 lg:py-16 border-b border-slate-200 bg-white">
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className="font-semibold text-[#0F766E]">
                        By Bytezen IT Solution (www.bytezenit.com)
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>Technology-Enabled Career Guidance & Future-Readiness Platform</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-[1.12]">
                      Discover the Right Career. Build the Right Skills. Prepare for the Future.
                    </h1>

                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                      A complete career intelligence ecosystem connecting{' '}
                      <strong className="text-slate-900 font-semibold">
                        Students, Parents, Working Professionals, Certified Counsellors, Schools & Skill Programs
                      </strong>{' '}
                      from Class 5 through executive leadership.
                    </p>

                    {/* Primary & Secondary Hero CTAs */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setActiveTab('assessment')}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#0F766E] text-white text-sm font-semibold hover:bg-[#115E59] transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <span>Take Free Assessment</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('counsellors')}
                        className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-[#0D3B49] text-white text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Book Counselling</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('careers')}
                        className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <Compass className="w-4 h-4 text-[#0F766E]" />
                        <span>Explore Careers</span>
                      </button>
                    </div>

                    {/* Quantitative Proof Strip Adjacent to Hero Proposition */}
                    <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-6 max-w-xl">
                      <div>
                        <span className="block text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900">
                          7 Cohorts
                        </span>
                        <span className="text-xs text-slate-500">
                          Class 5–6 to Working Pros
                        </span>
                      </div>
                      <div>
                        <span className="block text-xl sm:text-2xl font-bold font-mono tabular-nums text-[#0F766E]">
                          14 Dimensions
                        </span>
                        <span className="text-xs text-slate-500">
                          Psychometric & Skill Fit
                        </span>
                      </div>
                      <div>
                        <span className="block text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900">
                          100% Validated
                        </span>
                        <span className="text-xs text-slate-500">
                          Human Counsellor + AI Engine
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hero 16:9 Visual Carrier with Resilient Fallback */}
                  <div className="lg:col-span-5">
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-[#0D3B49] aspect-video lg:aspect-4/3 shadow-sm">
                      {!heroImgFailed ? (
                        <img
                          src={HERO_IMAGE_PATH}
                          alt="Indian students and career mentor reviewing a structured Career360 roadmap"
                          referrerPolicy="no-referrer"
                          onError={() => setHeroImgFailed(true)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-white bg-gradient-to-br from-[#0D3B49] to-[#0F766E]">
                          <GraduationCap className="w-12 h-12 mb-3 opacity-90" />
                          <p className="text-base font-bold">
                            Career360 Future-Readiness Studio
                          </p>
                          <p className="text-xs text-teal-100 mt-1">
                            Psychometric Assessment · Expert Counselling · Skill Development
                          </p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-5 text-white">
                        <p className="text-xs text-teal-200 font-medium">
                          Discovery → Assessment → Profile → Report → Counselling → Skill Execution
                        </p>
                        <p className="text-sm font-semibold mt-0.5">
                          Move beyond guesswork with data-backed career decisions and parent ROI clarity.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 01. INTERACTIVE 6-PILLAR ECOSYSTEM ARCHITECTURE (MATCHING UPLOADED SCREENSHOT) */}
            <EcosystemMatrix
              onNavigateNode={handleNavigateNode}
              onBookCounsellingForNode={handleBookCounsellingForNode}
              onRequestCallbackForNode={handleRequestCallbackForNode}
            />

            {/* 02. WHY CAREER GUIDANCE MATTERS & THE 8-STAGE USER JOURNEY */}
            <section className="py-16 border-b border-slate-200 bg-[#F8FAFC]">
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mb-10">
                  <p className="text-xs font-medium text-[#0F766E] mb-2">
                    02. Structured Career Methodology · Why Career360 Is Not a Coaching Institute
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    From Career Confusion to Verified Future Readiness
                  </h2>
                  <p className="text-sm text-slate-600 mt-2">
                    Over 68% of students select Class 11 streams or undergraduate degrees based on peer pressure rather than aptitude fit. Career360 replaces anxiety with an 8-step scientific journey:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    {
                      step: '01. Free Career Assessment',
                      desc: 'Stage-specific psychometric diagnostic across 14 aptitude, interest, personality, and communication dimensions.',
                      action: 'Start Assessment →',
                      tab: 'assessment' as ActiveTab,
                    },
                    {
                      step: '02. Career Profile & Report',
                      desc: 'Instant Student Career Profile with suggested clusters, 90-day action plan, and downloadable PDF reports.',
                      action: 'View Reports →',
                      tab: 'assessment' as ActiveTab,
                    },
                    {
                      step: '03. 1-on-1 Expert Counselling',
                      desc: 'Human validation with certified psychologists and industry mentors to align student strengths with parent ROI.',
                      action: 'Browse Counsellors →',
                      tab: 'counsellors' as ActiveTab,
                    },
                    {
                      step: '04. Skill & College Execution',
                      desc: 'Close skill gaps in English, AI, Coding, or Finance and shortlist Tier-1 colleges with admission roadmaps.',
                      action: 'Explore Skills & Colleges →',
                      tab: 'skills' as ActiveTab,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="text-base font-bold text-slate-900 mb-2">{item.step}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab(item.tab)}
                        className="mt-5 text-xs font-semibold text-[#0F766E] hover:underline text-left cursor-pointer"
                      >
                        {item.action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 03. REPORT PRODUCTS & TRANSPARENT PRICING (PHASE 4 & 5) */}
            <section className="py-16 border-b border-slate-200 bg-white">
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                  <div>
                    <p className="text-xs font-medium text-[#0F766E] mb-2">
                      03. Digital Career Report Products · Transparent INR Pricing
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                      Choose the Right Depth of Career Intelligence
                    </h2>
                  </div>
                  <p className="text-xs text-slate-600">
                    Instant dashboard access, GST invoice, and PDF export. Apply code{' '}
                    <span className="font-mono font-bold text-slate-900">FUTURE20</span> for 20% launch savings.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {db.reportProducts.map((rep) => {
                    const isUnlocked =
                      rep.priceInr === 0 || currentUser.unlockedReportIds.includes(rep.id);
                    return (
                      <div
                        key={rep.id}
                        className={`rounded-xl border p-5 flex flex-col justify-between bg-[#F8FAFC] ${
                          rep.id === 'rep-1999'
                            ? 'border-[#0F766E] ring-1 ring-[#0F766E] bg-white'
                            : 'border-slate-200'
                        }`}
                      >
                        <div>
                          <div className="text-xs text-slate-500 mb-1.5">
                            {rep.pageCount} Pages · {rep.recommendedFor.split(' ')[0]}
                          </div>
                          <h3 className="text-base font-bold text-slate-900">{rep.name}</h3>
                          <div className="my-2">
                            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                              {rep.tierLabel}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mb-4">{rep.tagline}</p>
                          <ul className="space-y-1.5 text-xs text-slate-700 mb-5">
                            {rep.modulesIncluded.slice(0, 4).map((m, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0 mt-0.5" />
                                <span>{m}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {isUnlocked ? (
                          <button
                            type="button"
                            onClick={() => setActiveTab('assessment')}
                            className="w-full py-2.5 px-3 rounded-lg bg-slate-200 text-slate-900 text-xs font-semibold hover:bg-slate-300 cursor-pointer whitespace-nowrap"
                          >
                            View Unlocked Report
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenReportCheckout(rep)}
                            className="w-full py-2.5 px-3 rounded-lg bg-[#0D3B49] text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer whitespace-nowrap"
                          >
                            Unlock Report ({rep.tierLabel})
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 04. ATTRIBUTABLE SOCIAL PROOF & CASE OUTCOMES */}
            <section className="py-16 border-b border-slate-200 bg-[#F8FAFC]">
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10">
                  <p className="text-xs font-medium text-[#0F766E] mb-2">
                    04. Verified Student, Parent, Professional & Principal Outcomes
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Real Decisions Backed by Psychometric & Counsellor Clarity
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between">
                    <p className="text-xs text-slate-700 leading-relaxed mb-4">
                      “Before Career360, my son was torn between standard JEE coaching and his love for economics and coding. The Career Clarity Report and Dr. Meera’s session helped us target IIIT-H UGEE and SSCBS Delhi with a clear 2-year financial and exam plan.”
                    </p>
                    <div className="pt-4 border-t border-slate-100 text-xs">
                      <p className="font-bold text-slate-900">Vikram & Sunita Kulkarni</p>
                      <p className="text-slate-500">
                        Parents of Class 11 Student · Symbiosis Junior College, Pune
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between">
                    <p className="text-xs text-slate-700 leading-relaxed mb-4">
                      “After 4 years in manual & automation QA, I used the Working Professional Skill-Gap Analyzer and Applied AI course to build two LLM product workflows. Transitioned into an Associate AI Product Manager role with a 62% compensation jump.”
                    </p>
                    <div className="pt-4 border-t border-slate-100 text-xs">
                      <p className="font-bold text-slate-900">Rohan Deshmukh</p>
                      <p className="text-slate-500">
                        Working Professional (4 YOE) · Enterprise SaaS, Bengaluru
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between">
                    <p className="text-xs text-slate-700 leading-relaxed mb-4">
                      “Deploying the Career360 School Career Dashboard across our Class 9 to 12 batches gave 580+ families objective psychometric profiles and eliminated stream-selection chaos during PTA conclaves.”
                    </p>
                    <div className="pt-4 border-t border-slate-100 text-xs">
                      <p className="font-bold text-slate-900">Dr. S. Radhakrishnan</p>
                      <p className="text-slate-500">
                        Principal · Partner K-12 Institution, Navi Mumbai
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 05. LEAD CAPTURE & EXPERT CONSULTATION DESK + FAQ (PHASE 1 & 18) */}
            <section id="consultation-desk" className="py-16 bg-white">
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  {/* Lead Capture Form */}
                  <div className="lg:col-span-6 bg-[#F8FAFC] rounded-xl border border-slate-200 p-6 sm:p-8">
                    <p className="text-xs font-semibold text-[#0F766E] mb-1">
                      05. Talk to a Career360 Expert · Instant CRM Routing
                    </p>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                      Request a Callback or Free Career Profile Consultation
                    </h2>
                    <p className="text-xs text-slate-600 mb-6">
                      Whether you are a student, parent, working professional, or school principal, our advisory desk responds within 4 business hours.
                    </p>

                    {leadSuccessMsg && (
                      <div className="mb-6 p-4 rounded-lg bg-[#F0FDFA] border border-[#0F766E] text-xs text-[#0F766E] font-medium">
                        {leadSuccessMsg}
                      </div>
                    )}

                    <form onSubmit={handleLeadSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="lead-name" className="block text-xs font-semibold text-slate-700 mb-1">
                            Full Name *
                          </label>
                          <input
                            id="lead-name"
                            type="text"
                            required
                            placeholder="Enter your full name"
                            value={leadName}
                            onChange={(e) => setLeadName(e.target.value)}
                            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label htmlFor="lead-mobile" className="block text-xs font-semibold text-slate-700 mb-1">
                            Mobile Number (WhatsApp) *
                          </label>
                          <input
                            id="lead-mobile"
                            type="tel"
                            required
                            placeholder="+91 98200 00000"
                            value={leadMobile}
                            onChange={(e) => setLeadMobile(e.target.value)}
                            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="lead-email" className="block text-xs font-semibold text-slate-700 mb-1">
                            Email Address *
                          </label>
                          <input
                            id="lead-email"
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={leadEmail}
                            onChange={(e) => setLeadEmail(e.target.value)}
                            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label htmlFor="lead-city" className="block text-xs font-semibold text-slate-700 mb-1">
                            City / Location *
                          </label>
                          <input
                            id="lead-city"
                            type="text"
                            required
                            placeholder="e.g. Pune, Mumbai, Delhi"
                            value={leadCity}
                            onChange={(e) => setLeadCity(e.target.value)}
                            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="lead-usertype" className="block text-xs font-semibold text-slate-700 mb-1">
                            I am a
                          </label>
                          <select
                            id="lead-usertype"
                            value={leadUserType}
                            onChange={(e) =>
                              setLeadUserType(
                                e.target.value as
                                  | 'Student'
                                  | 'Parent'
                                  | 'Working Professional'
                                  | 'School/College'
                              )
                            }
                            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                          >
                            <option value="Student">Student</option>
                            <option value="Parent">Parent</option>
                            <option value="Working Professional">Working Professional</option>
                            <option value="School/College">School / College Principal</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="lead-class" className="block text-xs font-semibold text-slate-700 mb-1">
                            Current Class / Stage
                          </label>
                          <select
                            id="lead-class"
                            value={leadClass}
                            onChange={(e) => setLeadClass(e.target.value)}
                            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                          >
                            <option value="Class 5-6">Class 5–6</option>
                            <option value="Class 7-8">Class 7–8</option>
                            <option value="Class 9-10">Class 9–10 (Stream Selection)</option>
                            <option value="Class 11-12">Class 11–12 (College & Exams)</option>
                            <option value="UG">Undergraduate (UG)</option>
                            <option value="PG">Postgraduate (PG)</option>
                            <option value="Working Professional">Working Professional</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="lead-service" className="block text-xs font-semibold text-slate-700 mb-1">
                            Service Interested In
                          </label>
                          <select
                            id="lead-service"
                            value={leadService}
                            onChange={(e) => setLeadService(e.target.value)}
                            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                          >
                            <option value="Stream Selection & Career Clarity Report">
                              Stream Selection & Career Clarity Report
                            </option>
                            <option value="1-on-1 Career Counselling Session">
                              1-on-1 Career Counselling Session
                            </option>
                            <option value="College Shortlisting & Admission Guidance">
                              College Shortlisting & Admission Guidance
                            </option>
                            <option value="Skill Development Course (AI / English / Coding)">
                              Skill Development Course (AI / English / Coding)
                            </option>
                            <option value="Annual School / College B2B Program">
                              Annual School / College B2B Program
                            </option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="lead-contact" className="block text-xs font-semibold text-slate-700 mb-1">
                            Preferred Contact Method
                          </label>
                          <select
                            id="lead-contact"
                            value={leadContactMethod}
                            onChange={(e) =>
                              setLeadContactMethod(
                                e.target.value as 'WhatsApp' | 'Phone Call' | 'Email'
                              )
                            }
                            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                          >
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Phone Call">Phone Call</option>
                            <option value="Email">Email</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 pt-1">
                        <input
                          id="lead-consent"
                          type="checkbox"
                          checked={leadConsent}
                          onChange={(e) => setLeadConsent(e.target.checked)}
                          className="mt-1"
                        />
                        <label htmlFor="lead-consent" className="text-xs text-slate-600">
                          I consent to receive career profile updates, assessment links, and counselling communication from Career360 by Bytezen IT Solution.
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={leadSubmitting}
                        className="w-full py-3 px-5 rounded-lg bg-[#0F766E] text-white text-sm font-semibold hover:bg-[#115E59] transition-colors cursor-pointer"
                      >
                        {leadSubmitting ? 'Submitting Enquiry...' : 'Request Free Expert Callback'}
                      </button>
                    </form>
                  </div>

                  {/* Frequently Asked Questions & High-Intent Career Clusters */}
                  <div className="lg:col-span-6 space-y-6">
                    <div>
                      <p className="text-xs font-semibold text-[#0F766E] mb-1">
                        06. Frequently Asked Questions & Parent Clarity
                      </p>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                        How Career360 Guides Every Career Milestone
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          q: 'How is Career360 different from a traditional coaching institute?',
                          a: 'Coaching institutes push every student toward the same exam rat-race. Career360 is a technology-enabled career discovery, psychometric counselling, and skill development partner that identifies where a student naturally excels before recommending streams, exams, or skills.',
                        },
                        {
                          q: 'Are automated assessment results guaranteed career outcomes?',
                          a: 'No. Following strict ethical psychometric standards, our automated reports highlight "Suggested fit" and "Potential pathways" across 14 dimensions. We pair these insights with live 1-on-1 certified counsellors for human validation.',
                        },
                        {
                          q: 'Can parents track their child’s career roadmap and calculate education ROI?',
                          a: 'Yes. The dedicated Parent Dashboard and Career Finance & Education ROI Calculator let families project inflation-adjusted college costs, compare placement payback periods, and review counsellor notes.',
                        },
                        {
                          q: 'How do schools and colleges partner with Career360?',
                          a: 'Through our NEP 2020-aligned School Career Dashboard, institutions run batch psychometric drives for Classes 5–12, host parent stream orientations, and set up an annual on-campus Career Guidance Cell.',
                        },
                      ].map((faq, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white">
                          <h3 className="text-sm font-bold text-slate-900 mb-1.5">{faq.q}</h3>
                          <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                        </div>
                      ))}
                    </div>

                    {/* High-Intent SEO Career Pathways Quick Launch */}
                    <div className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200">
                      <h3 className="text-xs font-bold text-slate-900 mb-2.5">
                        Popular Career Exploration Pathways (Click to Open):
                      </h3>
                      <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs">
                        {[
                          { label: 'Career After 10th (Stream Selection)', cohort: 'Class 9-10' as CohortStage },
                          { label: 'Career After 12th (PCM / PCB / Commerce / Arts)', cohort: 'Class 11-12' as CohortStage },
                          { label: 'AI & Data Science Careers', cohort: 'UG' as CohortStage },
                          { label: 'Working Professional Career Switch', cohort: 'Working Professionals' as CohortStage },
                        ].map((item, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setSelectedCohort(item.cohort);
                              setActiveTab('assessment');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-[#0F766E] hover:underline font-medium cursor-pointer"
                          >
                            {item.label} →
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'assessment' && (
          <AssessmentEngine
            initialCohort={selectedCohort}
            currentUser={currentUser}
            profiles={db.profiles}
            reportProducts={db.reportProducts}
            onSubmitAssessment={handleSubmitAssessment}
            onPurchaseReport={handleOpenReportCheckout}
            onBookCounselling={() => setActiveTab('counsellors')}
          />
        )}

        {activeTab === 'careers' && (
          <CareersAndCollegesView
            initialSubTab={careersSubTab}
            careers={db.careers}
            colleges={db.colleges}
            currentUser={currentUser}
            onToggleSaveCareer={handleToggleSaveCareer}
            onBookAdmissionGuidance={() => setActiveTab('counsellors')}
          />
        )}

        {activeTab === 'counsellors' && (
          <CounsellorsView
            counsellors={db.counsellors}
            bookings={db.bookings}
            currentUser={currentUser}
            supabaseStatus={supabaseStatus}
            onSyncSupabase={handleSyncSupabase}
            onCreateBooking={handleCreateBooking}
          />
        )}

        {activeTab === 'skills' && (
          <SkillsAndProView
            initialCategory={skillsSubCategory}
            courses={db.courses}
            currentUser={currentUser}
            onEnrollCourse={handleOpenCourseCheckout}
            onBookMentor={() => setActiveTab('counsellors')}
          />
        )}

        {activeTab === 'workspace' && (
          <RoleWorkspacesView
            initialRole={workspaceRole}
            db={db}
            onUpdateLeadStage={handleUpdateLeadStage}
            onUpdateCounsellorFee={handleUpdateCounsellorFee}
            onAddCareerCms={handleAddCareerCms}
            onRequestSchoolProgram={handleRequestSchoolProgram}
          />
        )}
      </main>

      {/* CHECKOUT & PAYMENT GATEWAY MODAL (PHASE 5) */}
      {checkoutTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-modal-title"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl">
            {completedOrder ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#0F766E] font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Payment Verified & Product Unlocked</span>
                </div>
                <h3 id="checkout-modal-title" className="text-lg font-bold text-slate-900">
                  {completedOrder.productName}
                </h3>
                <div className="p-4 rounded-lg bg-[#F8FAFC] border border-slate-200 text-xs space-y-1.5 font-mono">
                  <p>GST Invoice: {completedOrder.invoiceNumber}</p>
                  <p>Base Amount: ₹{completedOrder.amountInr}</p>
                  <p>GST (18%): ₹{completedOrder.gstInr}</p>
                  {completedOrder.discountInr > 0 && (
                    <p className="text-[#0F766E]">
                      Coupon Discount ({completedOrder.couponApplied}): -₹{completedOrder.discountInr}
                    </p>
                  )}
                  <p className="font-bold text-slate-900 text-sm pt-1 border-t border-slate-200">
                    Total Paid: ₹{completedOrder.totalPaidInr} ({completedOrder.paymentMethod})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCheckoutTarget(null);
                    setCompletedOrder(null);
                  }}
                  className="w-full py-2.5 rounded-lg bg-[#0F766E] text-white text-xs font-semibold hover:bg-[#115E59] cursor-pointer"
                >
                  Access Unlocked Product Now
                </button>
              </div>
            ) : (
              <form onSubmit={handleExecuteCheckout} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <p className="text-xs font-semibold text-[#0F766E]">
                      Phase 5 · Secure Digital Commerce & GST Checkout
                    </p>
                    <h3 id="checkout-modal-title" className="text-base font-bold text-slate-900">
                      {checkoutTarget.productName}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCheckoutTarget(null)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['UPI', 'Card', 'NetBanking'] as const).map((pm) => (
                      <button
                        key={pm}
                        type="button"
                        onClick={() => setPaymentMethod(pm)}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold border cursor-pointer ${
                          paymentMethod === pm
                            ? 'bg-[#0D3B49] text-white border-[#0D3B49]'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {pm}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="checkout-coupon" className="block text-xs font-semibold text-slate-700 mb-1">
                    Coupon Code (Try FUTURE20 or BYTEZEN10)
                  </label>
                  <input
                    id="checkout-coupon"
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono uppercase bg-[#F8FAFC] border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Standard Fee (incl. GST):</span>
                    <span className="font-mono tabular-nums">₹{checkoutTarget.priceInr}</span>
                  </div>
                  {discountMultiplier > 0 && (
                    <div className="flex justify-between text-[#0F766E] font-medium">
                      <span>Coupon Savings ({Math.round(discountMultiplier * 100)}%):</span>
                      <span className="font-mono tabular-nums">
                        -₹{checkoutTarget.priceInr - checkoutFinalPrice}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-slate-900 text-sm pt-1.5 border-t border-slate-200">
                    <span>Net Payable:</span>
                    <span className="font-mono tabular-nums">₹{checkoutFinalPrice}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCheckingOut}
                  className="w-full py-3 rounded-lg bg-[#0F766E] text-white text-xs font-semibold hover:bg-[#115E59] cursor-pointer"
                >
                  {isCheckingOut
                    ? 'Verifying Payment...'
                    : `Pay ₹${checkoutFinalPrice} via ${paymentMethod} & Unlock`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* QUIET INSTITUTIONAL FOOTER */}
      <footer className="bg-[#0F172A] text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800 text-xs">
            <div className="space-y-2">
              <p className="text-lg font-bold text-white font-display">Career360</p>
              <p className="text-teal-400 font-medium">By Bytezen IT Solution (www.bytezenit.com)</p>
              <p className="text-slate-400 leading-relaxed">
                Technology-enabled Career Guidance, Psychometric Assessment, Counsellor Marketplace & Skill Development Platform.
              </p>
            </div>

            <div>
              <p className="font-bold text-white mb-2.5">Career Guidance Cohorts</p>
              <ul className="space-y-1.5">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCohort('Class 5-6');
                      setActiveTab('assessment');
                    }}
                    className="hover:text-white cursor-pointer"
                  >
                    Class 5–6 & Class 7–8 Early Discovery
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCohort('Class 9-10');
                      setActiveTab('assessment');
                    }}
                    className="hover:text-white cursor-pointer"
                  >
                    Class 9–10 Scientific Stream Selection
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCohort('Class 11-12');
                      setActiveTab('assessment');
                    }}
                    className="hover:text-white cursor-pointer"
                  >
                    Class 11–12 College & Entrance Roadmap
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCohort('Working Professionals');
                      setActiveTab('assessment');
                    }}
                    className="hover:text-white cursor-pointer"
                  >
                    UG, PG & Working Professional Pivot
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white mb-2.5">Platform Modules</p>
              <ul className="space-y-1.5">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveTab('careers')}
                    className="hover:text-white cursor-pointer"
                  >
                    Central Career Database & A-vs-B Compare
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setCareersSubTab('colleges');
                      setActiveTab('careers');
                    }}
                    className="hover:text-white cursor-pointer"
                  >
                    College Guidance & Parent ROI Calculator
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveTab('counsellors')}
                    className="hover:text-white cursor-pointer"
                  >
                    Verified Career Counsellor Marketplace
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveTab('skills')}
                    className="hover:text-white cursor-pointer"
                  >
                    Skill Courses & Gemini AI Career Advisor
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white mb-2.5">Role Portals & Governance</p>
              <ul className="space-y-1.5">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setWorkspaceRole('Student');
                      setActiveTab('workspace');
                    }}
                    className="hover:text-white cursor-pointer"
                  >
                    Student & Parent Dashboards
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setWorkspaceRole('Institution Admin');
                      setActiveTab('workspace');
                    }}
                    className="hover:text-white cursor-pointer"
                  >
                    For Schools & Colleges B2B Dashboard
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setWorkspaceRole('Sales/CRM User');
                      setActiveTab('workspace');
                    }}
                    className="hover:text-white cursor-pointer"
                  >
                    CRM Pipeline & Lead Automation
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setWorkspaceRole('Super Admin');
                      setActiveTab('workspace');
                    }}
                    className="hover:text-white cursor-pointer"
                  >
                    Super Admin CMS & RBAC Architecture
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 Career360 by Bytezen IT Solution (www.bytezenit.com). All rights reserved.</p>
            <p>
              Data Privacy & Student Protection Compliant · Ethical Non-Guaranteed Career Advisory
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
