export interface NodeRichContent {
  headline: string;
  problemSolved: string;
  whoShouldChoose: string;
  durationOrTimeline: string;
  pricingOrTier: string;
  expectedOutcome: string;
  roadmapSteps: {
    stepNumber: string;
    title: string;
    detail: string;
  }[];
  keyHighlights: string[];
  faq: {
    question: string;
    answer: string;
  }[];
}

export const PILLAR_OVERVIEW_METADATA: Record<
  string,
  {
    subtitle: string;
    keyStatLabel: string;
    keyStatValue: string;
    pillarHighlight: string;
  }
> = {
  'career-guidance': {
    subtitle: 'Stage-Wise Psychometric Discovery & Longitudinal Roadmap (Class 5 to Working Professionals)',
    keyStatLabel: 'Cohorts Covered',
    keyStatValue: '7 Lifecycle Stages',
    pillarHighlight:
      'Moves learners from early curiosity discovery in Class 5–6 to scientific stream selection in Class 9–10, college shortlisting in Class 11–12, and mid-career pivots for professionals.',
  },
  'student-services': {
    subtitle: 'Complete Student Lifecycle Support from First Assessment to First Job',
    keyStatLabel: 'Core Student Services',
    keyStatValue: '9 Integrated Modules',
    pillarHighlight:
      'Connects psychometric assessment, 1-on-1 counselling, stream & college selection, skill-gap diagnostics, internships, and first-job readiness in one platform.',
  },
  'skill-development': {
    subtitle: 'Outcome-Driven Live Skill Bootcamps & Verifiable Student Portfolios',
    keyStatLabel: 'Skill Tracks',
    keyStatValue: '8 High-Demand Domains',
    pillarHighlight:
      'Translates career clarity into demonstrable real-world capabilities across English Speaking, Personality Development, Digital Marketing, Coding, Applied AI, Design, Finance, and Entrepreneurship.',
  },
  'parent-services': {
    subtitle: 'Objective Parent Alignment, Higher-Education Corpus Planning & Degree ROI',
    keyStatLabel: 'Family Planning Tools',
    keyStatValue: '4 Dedicated Services',
    pillarHighlight:
      'Helps parents support their child’s natural strengths without pressure while calculating inflation-adjusted higher education costs and placement payback periods.',
  },
  entrepreneurship: {
    subtitle: 'Venture Discovery, Startup Incubation & Young Entrepreneur Fellowship',
    keyStatLabel: 'Founder Tracks',
    keyStatValue: '3 Venture Programs',
    pillarHighlight:
      'Evaluates Job-vs-Business fit, guides early-stage MVP validation and unit economics, and trains school/college students to pitch live prototypes.',
  },
  'for-schools': {
    subtitle: 'NEP 2020-Aligned Institutional Career Cells, Batch Assessments & Principal Analytics',
    keyStatLabel: 'Institutional Modules',
    keyStatValue: '6 Turnkey B2B Solutions',
    pillarHighlight:
      'Empowers K-12 schools and colleges with campus career seminars, automated class-wise psychometric drives, PTA conclaves, and a live Principal Career Dashboard.',
  },
};

export const NODE_RICH_CONTENT: Record<string, NodeRichContent> = {
  // ================= PILLAR 1: CAREER GUIDANCE =================
  'cg-5-6': {
    headline: 'Class 5–6 Early Curiosity, Learning Style & Multiple-Intelligence Discovery',
    problemSolved:
      'At ages 10–12, children are often enrolled in random hobby or tuition classes without understanding how they naturally process information (visual, auditory, kinesthetic, or logical).',
    whoShouldChoose: 'Students in Class 5 & Class 6 and parents seeking stress-free early strength discovery.',
    durationOrTimeline: '30-Min Child-Friendly Diagnostic + 30-Min Parent Briefing',
    pricingOrTier: 'Free Starter Profile · ₹499 Career Snapshot',
    expectedOutcome:
      'Clear understanding of your child’s dominant learning style, curiosity clusters, and recommended co-curricular activities for the next 2 years.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Gamified Curiosity & Learning Style Check',
        detail: 'Non-intimidating situational questions evaluating visual, verbal, logical, creative, and interpersonal inclinations.',
      },
      {
        stepNumber: '02',
        title: 'Foundational Habit & Attention Mapping',
        detail: 'Identifies reading comprehension, numeric curiosity, and communication confidence baselines.',
      },
      {
        stepNumber: '03',
        title: 'Co-Curricular & Skill Activity Blueprint',
        detail: 'Matches the child to 2–3 high-joy foundational activities (e.g. Spoken English, Creative Coding, Financial Basics).',
      },
      {
        stepNumber: '04',
        title: 'Parent Observation & Encouragement Guide',
        detail: 'Actionable framework for parents to nurture intrinsic curiosity without exam pressure.',
      },
    ],
    keyHighlights: [
      'Zero academic rank pressure — focused 100% on innate curiosity',
      'Identifies Visual vs Logical vs Kinesthetic learning preference',
      'Includes Parent Observation Playbook for Classes 5 to 7',
    ],
    faq: [
      {
        question: 'Is Class 5–6 too early for career assessment?',
        answer:
          'We do not lock a child into a job title in Class 5–6. Instead, we identify their natural learning style and curiosity clusters so parents invest in the right foundational skills early.',
      },
    ],
  },
  'cg-7-8': {
    headline: 'Class 7–8 Pre-High-School Aptitude & Subject Affinity Exploration',
    problemSolved:
      'Students entering Class 9 often struggle when syllabus complexity jumps suddenly. Early aptitude mapping in Class 7–8 prevents subject phobia and builds project confidence.',
    whoShouldChoose: 'Class 7 & Class 8 students preparing for high-school academic transition.',
    durationOrTimeline: '40-Min Psychometric Assessment + Skill Exploration Plan',
    pricingOrTier: 'Free Starter · ₹499 Snapshot · ₹999 Clarity Report',
    expectedOutcome:
      'Early visibility into STEM vs Commerce vs Creative/Humanities affinity before high-school stream pressure begins.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Multi-Domain Aptitude Baseline',
        detail: 'Measures logical reasoning, spatial visualization, verbal fluency, and numerical comfort.',
      },
      {
        stepNumber: '02',
        title: 'Subject Affinity & Interest Triangulation',
        detail: 'Compares which subjects the student enjoys versus where they score effortlessly.',
      },
      {
        stepNumber: '03',
        title: 'Olympiad, Project & Skill Exposure Plan',
        detail: 'Recommends age-appropriate hackathons, design challenges, debate clubs, or coding labs.',
      },
      {
        stepNumber: '04',
        title: 'Pre-Class 9 Readiness Review',
        detail: 'Sets a 12-month habit plan for study autonomy and communication confidence.',
      },
    ],
    keyHighlights: [
      'Eliminates Math/Science anxiety through early diagnostic clarity',
      'Maps 4 broad career clusters for exploratory reading',
      'Builds a 2-year bridge into Class 9–10 stream selection',
    ],
    faq: [
      {
        question: 'How does this help before Class 9?',
        answer:
          'It gives students 2 full years to test their interests through real projects before making formal board stream choices in Class 10.',
      },
    ],
  },
  'cg-9-10': {
    headline: 'Class 9–10 Scientific Stream & Subject Combination Selection',
    problemSolved:
      'Over 65% of Class 10 students pick PCM, PCB, Commerce, or Humanities based on marks or peer herd mentality, leading to regret in Class 11–12.',
    whoShouldChoose: 'Class 9 & Class 10 students across CBSE, ICSE, IB, IGCSE, and State Boards.',
    durationOrTimeline: '45-Min 14-Dimension Assessment + 45-Min Counsellor Session',
    pricingOrTier: '₹999 Career Clarity Report · ₹1,999 Career Roadmap',
    expectedOutcome:
      'Scientifically validated Class 11 stream & optional subject choice (PCM, PCB, Commerce+Math, Humanities, or NEP Interdisciplinary) with top 3 career clusters.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: '14-Dimension Psychometric Stream Diagnostic',
        detail: 'Evaluates quantitative aptitude, scientific curiosity, commercial acumen, and creative/verbal strengths.',
      },
      {
        stepNumber: '02',
        title: 'Stream & Elective Combination Matrix',
        detail: 'Scores fit across PCM+CS, PCB+Psych, Commerce+Applied Math, and Humanities+Economics.',
      },
      {
        stepNumber: '03',
        title: 'Entrance Exam Eligibility Check',
        detail: 'Verifies how subject choices affect future eligibility for JEE, NEET, CUET, IPMAT, CLAT, UCEED, and NDA.',
      },
      {
        stepNumber: '04',
        title: 'Joint Student-Parent Stream Lock Session',
        detail: '1-on-1 certified counsellor review to align student passion with parent expectations.',
      },
    ],
    keyHighlights: [
      'Side-by-side comparison of Science vs Commerce vs Humanities fit',
      'Prevents costly stream changes mid-way through Class 11',
      'Includes 24-page Career Clarity Report + Exam Eligibility Guide',
    ],
    faq: [
      {
        question: 'What if my child’s marks are high in Science, but their interest is in Design or Law?',
        answer:
          'Our report maps interdisciplinary pathways (such as IIT Bombay B.Des via UCEED or Tech-IP Law) that honor both analytical aptitude and creative/legal ambition.',
      },
    ],
  },
  'cg-11-12': {
    headline: 'Class 11–12 Degree, Entrance Exam Calendar & College Shortlisting Blueprint',
    problemSolved:
      'Class 11–12 students face overwhelming entrance exam overlap (JEE, BITSAT, VITEEE, CUET, IPMAT, CLAT, NID) and miss high-ROI Plan-B colleges due to lack of structured tracking.',
    whoShouldChoose: 'Class 11 & Class 12 students (Science, Commerce, and Humanities) targeting premier Indian or global universities.',
    durationOrTimeline: 'Complete 38-Page Roadmap + 1-on-1 Admissions Strategy',
    pricingOrTier: '₹1,999 Career Roadmap · ₹2,999 Career Start (with Live Session)',
    expectedOutcome:
      'Locked Plan-A and Plan-B degree pathways, personalized entrance exam calendar, and a 15-college shortlist across Dream, Target, and Safe tiers.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Degree & Specialization Fit Audit',
        detail: 'Narrows down exact undergraduate programs (e.g. B.Tech AI vs B.S. Data Science vs BBA FIA vs BA LLB).',
      },
      {
        stepNumber: '02',
        title: 'Entrance Exam Prioritization Calendar',
        detail: 'Eliminates exam burnout by selecting 4–5 high-probability entrance tests aligned with student strengths.',
      },
      {
        stepNumber: '03',
        title: '15-College Shortlist & Cut-Off Mapping',
        detail: 'Data-backed college list comparing tuition fees, placement medians, and admission modes.',
      },
      {
        stepNumber: '04',
        title: 'Application, Portfolio & Interview Prep',
        detail: 'Prepares students for holistic admissions (IIIT-H UGEE, IPMAT, Symbiosis, Christ, Ashoka, NID).',
      },
    ],
    keyHighlights: [
      'Covers 40+ national & state entrance exams beyond just JEE/NEET',
      'Includes Plan-A, Plan-B, and Interdisciplinary backup options',
      'Integrated with Parent Education Finance & ROI Calculator',
    ],
    faq: [
      {
        question: 'Can Class 12 students take this mid-year?',
        answer:
          'Yes—especially between October and March when entrance exam forms (CUET, JEE, BITSAT, IPMAT, CLAT) open and college shortlisting is critical.',
      },
    ],
  },
  'cg-ug': {
    headline: 'UG Students: Specialization Clarity, Skill-Gap Analysis & Placement vs Higher-Ed',
    problemSolved:
      'Many undergraduate students (B.Tech, B.Com, BBA, BA, B.Sc) realize in 2nd or 3rd year that their college syllabus does not match corporate hiring or aren’t sure whether to sit for placements or pursue MBA/MS/GATE.',
    whoShouldChoose: '1st to 4th year undergraduate students across Engineering, Commerce, Management, Science, and Arts.',
    durationOrTimeline: '45-Min Employability Diagnostic + 90-Day Portfolio Sprint',
    pricingOrTier: '₹999 Clarity Report · ₹1,999 Career Roadmap',
    expectedOutcome:
      'Clear decision between Campus Placement vs Higher Studies (CAT/GATE/GRE/CFA) plus a 90-day skill & internship execution plan.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Industry Role & Specialization Matching',
        detail: 'Identifies high-growth roles matching your degree (e.g., AI Engineering, Product Management, FinTech, UX).',
      },
      {
        stepNumber: '02',
        title: 'Job vs PG / MBA ROI Evaluation',
        detail: 'Objective comparison of immediate corporate entry vs 2-year Master’s/MBA opportunity cost.',
      },
      {
        stepNumber: '03',
        title: 'Target Role Skill-Gap Audit',
        detail: 'Pinpoints exact technical and communication skills missing from your current resume.',
      },
      {
        stepNumber: '04',
        title: 'Internship, GitHub/Behance Portfolio & Placement Prep',
        detail: 'Actionable 90-day plan to ship 2 industry capstones and crack campus/off-campus interviews.',
      },
    ],
    keyHighlights: [
      'Resolves the "Job vs MBA vs MS" dilemma with ROI math',
      'Directly links skill gaps to 6–8 week live capstone courses',
      'Includes ATS resume & LinkedIn positioning blueprint',
    ],
    faq: [
      {
        question: 'I am in a Tier-2/Tier-3 college. How does this help?',
        answer:
          'We focus on off-campus proof-of-work portfolios, applied AI/coding/analytics projects, and communication mastery that bypass campus tier limitations.',
      },
    ],
  },
  'cg-pg': {
    headline: 'PG Students: Domain Specialization, R&D vs Corporate Track & Executive Readiness',
    problemSolved:
      'Postgraduate students (MBA, M.Tech, M.Sc, MA, LLM) need sharp domain positioning to command specialist roles and avoid generic entry-level placements.',
    whoShouldChoose: 'Master’s and Postgraduate scholars preparing for industry leadership, consulting, or R&D careers.',
    durationOrTimeline: 'Executive Assessment + 1-on-1 Industry Strategist Review',
    pricingOrTier: '₹1,999 Career Roadmap · ₹2,999 Career Start',
    expectedOutcome:
      'Targeted industry/domain matrix, thesis-to-industry positioning, and compensation negotiation readiness.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Specialist Domain & Industry Positioning',
        detail: 'Maps PG thesis/specialization to high-value sectors (DeepTech, Strategy Consulting, Quant Finance, BioTech).',
      },
      {
        stepNumber: '02',
        title: 'Corporate Leadership vs Research Track Analysis',
        detail: 'Evaluates long-term trajectory across enterprise R&D, product leadership, or PhD/fellowships.',
      },
      {
        stepNumber: '03',
        title: 'Executive Case Study & Interview Simulation',
        detail: 'Prepares candidates for multi-round case interviews and technical architecture reviews.',
      },
      {
        stepNumber: '04',
        title: 'Offer Evaluation & First-90-Days Leadership Plan',
        detail: 'Benchmarks compensation structures, ESOPs, and early leadership compounding.',
      },
    ],
    keyHighlights: [
      'Tailored for MBA, M.Tech, M.Sc, M.Des, and LLM cohorts',
      'Mentorship by IIM/IIT/Industry veterans',
      'Focuses on high-leverage specialist roles',
    ],
    faq: [
      {
        question: 'Does this include case interview guidance?',
        answer:
          'Yes, our senior strategists cover domain case frameworks, portfolio defense, and role-fit negotiation.',
      },
    ],
  },
  'cg-wp': {
    headline: 'Working Professionals: Mid-Career Pivot, AI-Era Upskilling & Salary Growth Roadmap',
    problemSolved:
      'Professionals with 1–12+ years of experience often hit compensation plateaus or face AI automation risks in legacy IT, support, operations, or traditional roles.',
    whoShouldChoose: 'Working professionals seeking domain transition, promotion acceleration, AI upskilling, or entrepreneurship.',
    durationOrTimeline: '16–24 Week Transition Blueprint + 1-on-1 Executive Coaching',
    pricingOrTier: '₹1,999 Professional Roadmap · ₹2,999 Career Start',
    expectedOutcome:
      'Concrete transition plan from current role to high-growth AI/Product/Strategy/Business track without losing domain leverage.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Transferable Competency & AI Disruption Audit',
        detail: 'Identifies which 60% of your past experience can be combined with 40% new-age skills for a high-paid pivot.',
      },
      {
        stepNumber: '02',
        title: 'Target Role & Compensation Band Mapping',
        detail: 'Selects realistic, high-growth target roles (e.g. QA → AI PM, Support → RevOps/Analytics, Dev → AI Architect).',
      },
      {
        stepNumber: '03',
        title: 'Weekend Proof-of-Work & Upskilling Sprint',
        detail: 'Builds 2 industry-grade portfolio projects while keeping your current job secure.',
      },
      {
        stepNumber: '04',
        title: 'Executive Resume, LinkedIn & Lateral Interview Conversion',
        detail: 'Repositions your work history around business impact to crack lateral hiring loops.',
      },
    ],
    keyHighlights: [
      'Zero career-gap transition strategy for working professionals',
      'Includes Job-vs-Business readiness evaluation',
      '1-on-1 sessions with 15+ year industry mentors',
    ],
    faq: [
      {
        question: 'Can I switch domains after 4–6 years of experience without starting as a fresher?',
        answer:
          'Yes—by targeting "bridge roles" (such as Domain Product Manager, FinTech Business Analyst, or Applied AI Solutions Lead) that value your existing industry knowledge.',
      },
    ],
  },

  // ================= PILLAR 2: STUDENT SERVICES =================
  'ss-assessment': {
    headline: '14-Dimension Psychometric & Future-Readiness Career Assessment',
    problemSolved:
      'Replaces generic 10-minute internet quizzes with a cohort-calibrated psychometric engine measuring aptitude, interest, personality, communication, AI fluency, and financial awareness.',
    whoShouldChoose: 'Every student (Class 5 to PG) and professional starting their Career360 journey.',
    durationOrTimeline: '35–45 Minutes Online · Auto-Save Enabled · Instant Profile',
    pricingOrTier: 'Free Career Starter · Paid Reports from ₹499 to ₹2,999',
    expectedOutcome:
      'Instant Student Career Profile with Readiness Index, 14-dimension scores, top 3 career clusters, and 90-day action plan.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Cohort Selection (7 Calibrated Versions)',
        detail: 'Questions automatically adapt to Class 5–6, 7–8, 9–10, 11–12, UG, PG, or Working Professional context.',
      },
      {
        stepNumber: '02',
        title: 'Multi-Dimensional Psychometric Evaluation',
        detail: 'Covers Analytical Aptitude, Domain Curiosity, Tech/AI Fluency, Communication, and Entrepreneurial Mindset.',
      },
      {
        stepNumber: '03',
        title: 'Algorithmic Scoring & Cluster Triangulation',
        detail: 'Maps strengths and development areas to Suggested High-Fit and Potential-Fit career clusters.',
      },
      {
        stepNumber: '04',
        title: 'Digital Report & Counsellor Validation Handoff',
        detail: 'Generates printable HTML/PDF career profile ready for 1-on-1 expert review.',
      },
    ],
    keyHighlights: [
      'Ethical non-guaranteed phrasing (Suggested Fit & Exploration)',
      'Instant visual breakdown of strengths vs development gaps',
      'Available 24/7 on mobile, tablet, and desktop',
    ],
    faq: [
      {
        question: 'Can a student pause and resume the assessment?',
        answer: 'Yes, progress is auto-saved at every dimension step.',
      },
    ],
  },
  'ss-counselling': {
    headline: '1-on-1 Certified Career Counselling (Online & Offline)',
    problemSolved:
      'Automated reports alone cannot understand family context, subtle emotional hesitations, or local college realities. Human counsellors validate data with empathy.',
    whoShouldChoose: 'Students and parents seeking personalized, expert validation of stream, college, or career plans.',
    durationOrTimeline: '45-Minute Deep-Dive Session + Post-Session Written Summary',
    pricingOrTier: '₹1,299 – ₹1,999 per Session (or ₹2,999 Bundle with Full Report)',
    expectedOutcome:
      'Counsellor-validated Personal Career Plan with complete student-parent alignment and next-step clarity.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Pre-Session Dossier & Report Audit',
        detail: 'Your counsellor reviews your Student Career Profile and academic history before the call.',
      },
      {
        stepNumber: '02',
        title: '45-Min Student & Parent Triangulation',
        detail: 'Open exploration of top 3 career clusters, myths vs realities, and student motivation.',
      },
      {
        stepNumber: '03',
        title: 'Stream, Exam & College Action Locking',
        detail: 'Finalizes concrete academic choices and eliminates conflicting exam preparation.',
      },
      {
        stepNumber: '04',
        title: 'Post-Session Counsellor Notes & Follow-Up',
        detail: 'Written counselor recommendations uploaded directly to the Student & Parent Dashboard.',
      },
    ],
    keyHighlights: [
      'GCDF, PhD Psychology, IIM/IIT & TISS-credentialed counsellors',
      'Multi-language support (English, Hindi, Marathi, Malayalam)',
      'Live slot booking with instant meeting link & WhatsApp reminders',
    ],
    faq: [
      {
        question: 'Should parents attend the counselling session?',
        answer:
          'We strongly encourage parents to join the last 20 minutes of the session so academic and financial expectations are aligned.',
      },
    ],
  },
  'ss-stream': {
    headline: 'Scientific Stream & NEP-2020 Subject Selection (After Class 10)',
    problemSolved:
      'Prevents choosing Science out of fear of missing out, or choosing Commerce/Arts without knowing quantitative/analytical requirements for top colleges.',
    whoShouldChoose: 'Class 8, 9, and 10 students and parents preparing for Class 11 subject registration.',
    durationOrTimeline: 'Assessment + Stream Comparator + 1-on-1 Session',
    pricingOrTier: '₹999 Career Clarity Report · ₹1,499 Counsellor Session',
    expectedOutcome:
      'Definitive choice between PCM, PCB, PCMB, Commerce (with/without Math), and Humanities with 5th/6th elective selection.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Aptitude vs Subject Load Compatibility',
        detail: 'Tests whether quantitative and abstract reasoning match Class 11–12 Physics/Math rigor.',
      },
      {
        stepNumber: '02',
        title: 'Elective Subject Multiplier Analysis',
        detail: 'Shows how adding Applied Math, Economics, Computer Science, or Psychology unlocks 3x more degrees.',
      },
      {
        stepNumber: '03',
        title: 'Career A vs Career B Stream Comparison',
        detail: 'Compares 5-year outcomes, costs, and competition across streams.',
      },
      {
        stepNumber: '04',
        title: 'Board & School Subject Registration Sign-Off',
        detail: 'Final checklist before locking Class 11 subjects at school.',
      },
    ],
    keyHighlights: [
      'Covers CBSE, ICSE/ISC, IB, Cambridge IGCSE, and State Boards',
      'Highlights high-paying non-JEE/non-NEET pathways in every stream',
      'Prevents Class 11 academic drop-off',
    ],
    faq: [
      {
        question: 'Is Mathematics mandatory for top Commerce/Management degrees?',
        answer:
          'For premier programs like DU BMS/BBA(FIA) at SSCBS and Economics (Hons), Class 12 Mathematics/Applied Math is mandatory in CUET. We flag these rules early.',
      },
    ],
  },
  'ss-planning': {
    headline: 'Long-Term Career Planning & 90-Day Milestone Architecture',
    problemSolved:
      'Turns vague career dreams ("I want to work in AI" or "I want to become a corporate lawyer") into a quarter-by-quarter execution roadmap.',
    whoShouldChoose: 'Class 9 to UG students who know their broad direction and need a structured execution plan.',
    durationOrTimeline: '90-Day Sprint + 3-to-5 Year Longitudinal Roadmap',
    pricingOrTier: '₹1,999 Career Roadmap Report',
    expectedOutcome:
      'Documented 5-year academic pathway, entrance exam timeline, and 90-day skill milestone tracker.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Primary & Backup Career Architecture',
        detail: 'Defines closely related Plan-A and Plan-B careers so effort compounds across both.',
      },
      {
        stepNumber: '02',
        title: 'Academic & Competitive Exam Calendar',
        detail: 'Maps exact preparation windows from Class 9/11 through university admission.',
      },
      {
        stepNumber: '03',
        title: 'Co-Curricular & Certification Stacking',
        detail: 'Schedules 1 skill certification per semester without disturbing board/semester exams.',
      },
      {
        stepNumber: '04',
        title: 'Quarterly Progress Tracking on Student Dashboard',
        detail: 'Tracks completion across assessments, skills, and applications.',
      },
    ],
    keyHighlights: [
      'Includes 38-page personalized Career Roadmap document',
      'Built-in Plan-B safety net for competitive exams',
      'Editable Student Career Profile as skills grow',
    ],
    faq: [
      {
        question: 'Can the roadmap be updated as the student progresses from Class 9 to 12?',
        answer: 'Yes, the Student Dashboard maintains version history across every grade transition.',
      },
    ],
  },
  'ss-college': {
    headline: 'Data-Backed College Guidance, Shortlisting & Admission Strategy',
    problemSolved:
      'Families often apply to only 3–4 famous colleges or fall prey to misleading private university advertisements without checking median placements and ROI.',
    whoShouldChoose: 'Class 11–12 students and UG graduates applying for Indian Universities.',
    durationOrTimeline: 'Shortlist Generation + Admission Window Support',
    pricingOrTier: 'Included in ₹1,999 Roadmap · Dedicated Admission Desk Available',
    expectedOutcome:
      'Curated shortlist of Dream, Target, and Safe colleges matched to academic profile, budget, and placement ROI.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Profile, Budget & Location Filtering',
        detail: 'Matches student stream, expected percentile, and family budget against verified institutions.',
      },
      {
        stepNumber: '02',
        title: 'Entrance Exam & Cut-Off Mapping',
        detail: 'Tracks JEE, CUET, BITSAT, UGEE, IPMAT, CLAT, UCEED, and state CET cut-off benchmarks.',
      },
      {
        stepNumber: '03',
        title: 'Tuition Fee vs Median Placement ROI Check',
        detail: 'Evaluates total 4/5-year program cost against verified median placement packages.',
      },
      {
        stepNumber: '04',
        title: 'Counselling Round & Choice-Filling Guidance',
        detail: 'Prevents choice-filling mistakes during JoSAA, CSAS (DU), CLAT, and private admission rounds.',
      },
    ],
    keyHighlights: [
      'Zero biased university sponsorships — 100% merit & ROI driven',
      'Covers IITs/NITs/IIITs, DU, IIM IPM, NLUs, NID/IIT-IDC, BITS & top private universities',
      'Integrated with Parent Education ROI Calculator',
    ],
    faq: [
      {
        question: 'Do you help with interdisciplinary colleges like IIIT-H UGEE or IIM IPM?',
        answer: 'Yes, our database specifically highlights high-ROI multi-channel admissions beyond standard exams.',
      },
    ],
  },
  'ss-skillgap': {
    headline: 'AI-Assisted Skill-Gap Analysis & Competency Benchmarking',
    problemSolved:
      'Academic degrees rarely teach the practical skills (executive articulation, AI workflow automation, financial literacy, problem prototyping) demanded by modern employers.',
    whoShouldChoose: 'Class 9–12 students, UG/PG scholars, and Working Professionals.',
    durationOrTimeline: 'Instant AI Diagnostic + Matched 4–8 Week Skill Modules',
    pricingOrTier: 'Included in Career360 AI Engine · Courses from ₹2,999',
    expectedOutcome:
      'Side-by-side matrix of your current skill baseline vs target career requirements with exact course recommendations.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Current Skill & Subject Inventory',
        detail: 'Captures existing technical, analytical, and communication capabilities.',
      },
      {
        stepNumber: '02',
        title: 'Target Career Competency Benchmarking',
        detail: 'Compares your profile against the top 5 core skills required in your chosen career cluster.',
      },
      {
        stepNumber: '03',
        title: 'Priority Deficit Ranking',
        detail: 'Flags critical gaps (e.g., Spoken English poise, Python logic, or Applied AI workflows).',
      },
      {
        stepNumber: '04',
        title: 'Direct Enrollment into Matched Skill Capstone',
        detail: 'Recommends the exact Career360 skill course to close the gap with a certified project.',
      },
    ],
    keyHighlights: [
      'Powered by the server-side Gemini AI Career Engine',
      'Evaluates both technical and human/communication competencies',
      'Directly bridges Career Guidance into Skill Development',
    ],
    faq: [
      {
        question: 'How often should I run a skill-gap analysis?',
        answer: 'We recommend running it once every 6 months as you complete projects and courses.',
      },
    ],
  },
  'ss-internship': {
    headline: 'Internship Guidance, Proof-of-Work & Project Portfolio Building',
    problemSolved:
      'Students struggle to get their first internship because their resume only lists classroom subjects with zero real-world projects.',
    whoShouldChoose: 'Class 11–12 portfolio builders and 1st-to-3rd year UG/PG students.',
    durationOrTimeline: '4–8 Week Portfolio Sprint + Outreach Playbook',
    pricingOrTier: 'Included with Skill Courses & UG Career Roadmap',
    expectedOutcome:
      '2–3 deployed GitHub, Figma, or campaign case-study projects + high-conversion internship application strategy.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Proof-of-Work Capstone Selection',
        detail: 'Selects a real industry problem in AI, Coding, Design, Marketing, or Finance.',
      },
      {
        stepNumber: '02',
        title: 'Mentor-Guided Project Execution',
        detail: 'Build, document, and publish your project with clean metrics and live links.',
      },
      {
        stepNumber: '03',
        title: 'Resume & Portfolio Architecture',
        detail: 'Structures your resume around problem-action-outcome bullet points.',
      },
      {
        stepNumber: '04',
        title: 'Cold Outreach & Founder/Recruiter Pitching',
        detail: 'Templates and strategies to win research and startup internships.',
      },
    ],
    keyHighlights: [
      'Replaces fake "certificate collecting" with real deployed work',
      'Prepares students for both research (IIT/IISER) and corporate internships',
      'Builds early workplace confidence',
    ],
    faq: [
      {
        question: 'Can 1st or 2nd year college students land meaningful internships?',
        answer: 'Yes—startups and research labs actively recruit 1st/2nd year students who demonstrate shipped projects.',
      },
    ],
  },
  'ss-employability': {
    headline: 'Campus-to-Corporate Employability & Interview Readiness',
    problemSolved:
      'Even technically strong students get rejected in final placement rounds due to weak group discussion (GD) presence, unstructured answers, and lack of commercial awareness.',
    whoShouldChoose: 'Pre-final and final-year UG/PG students preparing for campus or off-campus placements.',
    durationOrTimeline: '6–8 Week Intensive Readiness Track',
    pricingOrTier: '₹3,999 – ₹5,499 Skill & Employability Track',
    expectedOutcome:
      'ATS-optimized resume, Group Discussion mastery, and structured mock interview clearance.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'ATS Resume & LinkedIn Audit',
        detail: 'Eliminates generic templates and highlights verifiable projects and skills.',
      },
      {
        stepNumber: '02',
        title: 'Aptitude & Problem-Solving Drills',
        detail: 'Sharpens quantitative, logical, and domain problem-solving under time constraints.',
      },
      {
        stepNumber: '03',
        title: 'Group Discussion & Pyramid Communication',
        detail: 'Trains students to structure persuasive arguments using the Pyramid Principle.',
      },
      {
        stepNumber: '04',
        title: '1-on-1 Recorded Mock Panel Interviews',
        detail: 'Realistic HR + Technical interview simulation with actionable scorecard feedback.',
      },
    ],
    keyHighlights: [
      'Combines technical defense with executive communication',
      'Includes recorded video feedback on body language and tonality',
      'Verified Career360 Employability Certificate',
    ],
    faq: [
      {
        question: 'Does this help with non-tech management and commerce roles too?',
        answer: 'Yes, we customize mock interviews for Tech, Product, Finance, Marketing, and Consulting roles.',
      },
    ],
  },
  'ss-firstjob': {
    headline: 'First-Job Selection, Offer Evaluation & First-90-Days Success Plan',
    problemSolved:
      'Fresh graduates often pick their first job based solely on headline CTC (ignoring fixed vs variable pay and learning curve) or struggle during their first 90 days in a corporate team.',
    whoShouldChoose: 'Final-year students and fresh graduates entering their first full-time role.',
    durationOrTimeline: 'Offer Review Session + 90-Day Onboarding Playbook',
    pricingOrTier: 'Included in UG/PG Career Start Package',
    expectedOutcome:
      'Objective offer comparison (learning velocity vs compensation) and a 90-day workplace excellence roadmap.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Offer Letter & CTC Breakdown Analysis',
        detail: 'Decodes base salary, variable bonus, ESOPs, bond clauses, and role growth trajectory.',
      },
      {
        stepNumber: '02',
        title: 'Role & Manager Compounding Check',
        detail: 'Evaluates which first job sets up the strongest 3-year career capital.',
      },
      {
        stepNumber: '03',
        title: 'Workplace Etiquette & Stakeholder Communication',
        detail: 'Masters professional email/Slack communication, standups, and expectation management.',
      },
      {
        stepNumber: '04',
        title: 'First-Year Financial & Upskilling Plan',
        detail: 'Sets up emergency fund, tax/investment basics, and continuous learning habits.',
      },
    ],
    keyHighlights: [
      'Prevents signing restrictive employment bonds blindly',
      'Accelerates time-to-first-promotion',
      'Includes Young Professional Financial Literacy checklist',
    ],
    faq: [
      {
        question: 'Should a fresher choose a high-brand service company or a product startup?',
        answer:
          'We evaluate this based on your 5-year goal (e.g., MBA prep vs rapid engineering ownership) and risk appetite.',
      },
    ],
  },

  // ================= PILLAR 3: SKILL DEVELOPMENT =================
  'sd-english': {
    headline: 'Executive English Speaking, Articulation & Public Speaking Lab',
    problemSolved:
      'Millions of bright students understand concepts deeply in their native language or on paper, but hesitate when speaking in English during interviews, debates, or presentations.',
    whoShouldChoose: 'Class 5–12 students, college freshers, and professionals seeking fluent, confident spoken English.',
    durationOrTimeline: '8 Weeks (32 Live Interactive Hours · Max 15 per Batch)',
    pricingOrTier: '₹3,999 (incl. GST & Certification)',
    expectedOutcome:
      'Deliver a 5-minute structured public talk, lead group discussions, and speak naturally without translation hesitation.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Fluency Diagnostics & Hesitation Removal',
        detail: 'Identifies grammar bottlenecks, filler words, and pronunciation patterns in a supportive small cohort.',
      },
      {
        stepNumber: '02',
        title: 'Structured Thinking (The Pyramid Principle)',
        detail: 'Trains learners to organize thoughts into clear Opening → 3 Key Points → Conclusion in real time.',
      },
      {
        stepNumber: '03',
        title: 'Live Group Discussions, Debates & Roleplays',
        detail: 'High-speaking-time breakout rooms covering current affairs, workplace scenarios, and storytelling.',
      },
      {
        stepNumber: '04',
        title: 'TED-Style Capstone Talk & Mock Interview',
        detail: 'Recorded final showcase with personalized trainer evaluation and certificate.',
      },
    ],
    keyHighlights: [
      'Led by CELTA-certified communication coach Avantika Sen',
      '80% active student speaking time — zero passive lectures',
      'Directly boosts Interview & Group Discussion conversion',
    ],
    faq: [
      {
        question: 'Are batches separated by age group?',
        answer: 'Yes—we run separate cohorts for School Students (Class 5–12) and College/Working Adults.',
      },
    ],
  },
  'sd-personality': {
    headline: 'Personality Development, Executive Presence & Emotional Intelligence',
    problemSolved:
      'Academic marks get you to the door, but leadership confidence, body language, empathy, and resilience determine long-term career trajectory.',
    whoShouldChoose: 'School students (Class 5–12) and college learners building self-confidence and leadership poise.',
    durationOrTimeline: '6 Weeks (24 Live Workshop Hours)',
    pricingOrTier: '₹3,499 (incl. GST & Certification)',
    expectedOutcome:
      'Visible transformation in stage confidence, body language, conflict resolution, and personal presentation.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Self-Awareness & Growth Mindset Foundations',
        detail: 'Overcomes stage fright, social comparison, and fear of public mistakes.',
      },
      {
        stepNumber: '02',
        title: 'Non-Verbal Presence, Body Language & Etiquette',
        detail: 'Masters posture, eye contact, vocal projection, and professional/social etiquette.',
      },
      {
        stepNumber: '03',
        title: 'Emotional Intelligence, Teamwork & Leadership',
        detail: 'Simulation exercises on active listening, negotiation, and leading student/project teams.',
      },
      {
        stepNumber: '04',
        title: 'Personal Brand & Leadership Showcase',
        detail: 'Students present a live leadership pitch to peers and parents.',
      },
    ],
    keyHighlights: [
      'Activity-based leadership simulations and roleplays',
      'Builds resilience against academic and peer stress',
      'Includes Parent Progress Feedback Report',
    ],
    faq: [
      {
        question: 'How do you measure progress in personality development?',
        answer: 'Through baseline vs week-6 video recordings of student presentations and participation rubrics.',
      },
    ],
  },
  'sd-dm': {
    headline: 'Performance Digital Marketing, SEO & AI Content Growth Engine',
    problemSolved:
      'Most marketing courses teach outdated theory. Modern brands and startups need marketers who understand buyer psychology, SEO, paid ad ROAS, and AI content workflows.',
    whoShouldChoose: 'Class 11–12 students, college learners, freelancers, and aspiring business owners.',
    durationOrTimeline: '6 Weeks (24 Live Hours + Live Campaign Capstone)',
    pricingOrTier: '₹4,499 (incl. GST & Certification)',
    expectedOutcome:
      'Job-ready and freelance-ready digital marketing portfolio with live SEO audit and ad campaign metrics.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Buyer Psychology & Funnel Positioning',
        detail: 'Understand how customers discover, evaluate, and purchase products online.',
      },
      {
        stepNumber: '02',
        title: 'Technical SEO & High-Retention Content Strategy',
        detail: 'Keyword research, on-page SEO, and short-form video / LinkedIn / blog copywriting.',
      },
      {
        stepNumber: '03',
        title: 'Meta & Google Performance Ads + Analytics',
        detail: 'Campaign structure, audience targeting, CAC vs LTV math, and GA4 conversion tracking.',
      },
      {
        stepNumber: '04',
        title: 'Live Brand Growth Audit Capstone',
        detail: 'Build a complete 30-day growth plan for a real D2C or SaaS brand.',
      },
    ],
    keyHighlights: [
      'Taught by Growth Lead Neha Kapoor (₹25Cr+ managed ad spend)',
      'Integrates AI tools for rapid copy, creative, and analytics',
      'Opens immediate freelancing and internship opportunities',
    ],
    faq: [
      {
        question: 'Do I need coding knowledge for Digital Marketing?',
        answer: 'No coding is required; we teach all analytics and campaign tools from scratch.',
      },
    ],
  },
  'sd-coding': {
    headline: 'Python, Algorithmic Thinking & Full-Stack Web Foundations',
    problemSolved:
      'School computer classes often force students to memorize syntax on paper without ever building or deploying a real working software application.',
    whoShouldChoose: 'Class 6–12 students and UG beginners wanting strong computational and software foundations.',
    durationOrTimeline: '8 Weeks (32 Live Coding Hours · Max 16 per Batch)',
    pricingOrTier: '₹5,499 (incl. GST & Certification)',
    expectedOutcome:
      '3 live software projects deployed on GitHub with clean Python and modern web code.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Computational Logic & Python Core',
        detail: 'Variables, control flow, functions, data structures, and algorithmic problem decomposition.',
      },
      {
        stepNumber: '02',
        title: 'APIs, Data Automation & Scripting',
        detail: 'Fetch real-world JSON APIs, automate data processing, and build CLI utilities.',
      },
      {
        stepNumber: '03',
        title: 'Interactive Web UI & Full-Stack Integration',
        detail: 'Connect backend logic to responsive web interfaces.',
      },
      {
        stepNumber: '04',
        title: 'GitHub Portfolio & Live Web Deployment',
        detail: 'Push code with Git and deploy a live shareable web application.',
      },
    ],
    keyHighlights: [
      '100% hands-on live coding with Senior Engineer Rohan Kulkarni',
      'Builds real GitHub proof-of-work for college & internship applications',
      'Prepares foundation for AI & Data Science tracks',
    ],
    faq: [
      {
        question: 'Can a complete beginner with zero prior coding join?',
        answer: 'Yes, Module 1 starts from first principles of logical thinking before writing code.',
      },
    ],
  },
  'sd-ai': {
    headline: 'Applied Generative AI, Prompt Engineering & Workflow Automation Lab',
    problemSolved:
      'AI will not replace professionals—but professionals who know how to build AI workflows will outperform those who do not. Students and pros need practical, ethical AI mastery.',
    whoShouldChoose: 'Class 9–12 students, UG/PG scholars, and Working Professionals across all streams.',
    durationOrTimeline: '6 Weeks (24 Live Hours · Max 20 per Batch)',
    pricingOrTier: '₹4,999 (incl. GST & Verified Certification)',
    expectedOutcome:
      'Build and deploy 2 custom AI assistants / automation workflows in your student or professional portfolio.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'How Modern LLMs & Multimodal AI Work',
        detail: 'Clear mental models of tokens, embeddings, context windows, hallucinations, and evaluation.',
      },
      {
        stepNumber: '02',
        title: 'Structured Prompt Engineering & Reasoning Chains',
        detail: 'System prompts, few-shot examples, structured JSON schemas, and domain-specific assistants.',
      },
      {
        stepNumber: '03',
        title: 'AI Research, Data Synthesis & Workflow Automation',
        detail: 'Automate research, document analysis, coding assistance, and study/business pipelines.',
      },
      {
        stepNumber: '04',
        title: 'Capstone: Ship a Domain-Specific AI Copilot',
        detail: 'Present a working AI workflow tailored to your target career cluster.',
      },
    ],
    keyHighlights: [
      'Led by Principal AI Architect Siddharth Rao (Ex-Microsoft, IIT Roorkee)',
      'Suitable for both STEM and Commerce/Humanities learners',
      'Emphasizes ethical, verifiable AI usage',
    ],
    faq: [
      {
        question: 'Is this course only for programmers?',
        answer: 'No—both coders and non-coders learn to build high-leverage AI workflows and prompt architectures.',
      },
    ],
  },
  'sd-design': {
    headline: 'Graphic Design, Visual Communication & UI/UX Foundations (Figma)',
    problemSolved:
      'Creative students often lack structured training in typography, color math, layout hierarchy, and modern digital product tools like Figma.',
    whoShouldChoose: 'Creative learners (Class 7 to UG), aspiring NID/UCEED candidates, and digital creators.',
    durationOrTimeline: '6 Weeks (24 Live Studio Hours)',
    pricingOrTier: '₹4,499 (incl. GST & Portfolio Certification)',
    expectedOutcome:
      'Published Behance/Figma design portfolio featuring a complete brand identity and mobile/web app UI prototype.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Visual Hierarchy, Typography & Color Systems',
        detail: 'Learn why great designs look effortless using grid systems, contrast, and spacing math.',
      },
      {
        stepNumber: '02',
        title: 'Brand Identity & Digital Visual Design',
        detail: 'Design logos, editorial layouts, social systems, and packaging concepts.',
      },
      {
        stepNumber: '03',
        title: 'UI/UX Design & Interactive Prototyping in Figma',
        detail: 'Wireframing, component libraries, auto-layout, and clickable user flows.',
      },
      {
        stepNumber: '04',
        title: 'Design Portfolio & Critique Showcase',
        detail: 'Compile a 3-project case study portfolio ready for design colleges or freelance clients.',
      },
    ],
    keyHighlights: [
      'Hands-on mastery of industry-standard Figma workflows',
      'Strong foundation for UCEED / NID / NIFT portfolio rounds',
      'Includes real client brief simulation',
    ],
    faq: [
      {
        question: 'Do I need an expensive tablet or paid software?',
        answer: 'No, Figma runs free in any standard laptop browser.',
      },
    ],
  },
  'sd-finance': {
    headline: 'Young Investor: Financial Literacy, Budgeting & Stock Market Education',
    problemSolved:
      'Schools teach trigonometry and history, but students graduate without knowing how inflation, compounding, credit cards, taxation, or equity markets work.',
    whoShouldChoose: 'Class 7–12 students, college learners, and young professionals.',
    durationOrTimeline: '4 Weeks (16 Live Hours · Sunday Cohorts)',
    pricingOrTier: '₹2,999 (incl. GST & Certification)',
    expectedOutcome:
      'Construct a 10-year personal wealth & budgeting model and read company financial statements with confidence.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Money Systems, Inflation, Banking & Credit Discipline',
        detail: 'How banking, UPI, loans, interest rates, and credit scores work in India.',
      },
      {
        stepNumber: '02',
        title: 'The Mathematics of Compounding & Asset Allocation',
        detail: 'FD vs Debt vs Gold vs Index Funds vs Equity over 5, 10, and 20-year horizons.',
      },
      {
        stepNumber: '03',
        title: 'Stock Market Education & Business Fundamentals',
        detail: 'How stock exchanges (NSE/BSE) work, reading P&L statements, and avoiding speculative traps.',
      },
      {
        stepNumber: '04',
        title: 'Capstone: 10-Year Goal-Based Financial Plan',
        detail: 'Build a custom financial model reviewed by a Chartered Accountant & CFA.',
      },
    ],
    keyHighlights: [
      'Taught by CA Pranav Joshi (CA & CFA Charterholder)',
      '100% educational & long-term fundamentals (zero speculative trading tips)',
      'Builds lifelong financial responsibility',
    ],
    faq: [
      {
        question: 'Is this safe and appropriate for school students?',
        answer:
          'Yes—it focuses on saving habits, compounding math, scam prevention, and how real businesses create value.',
      },
    ],
  },
  'sd-ent': {
    headline: 'Entrepreneurship Bootcamp: Problem Discovery to Unit Economics & Pitch',
    problemSolved:
      'Teaches learners to spot real problems around them, design a solution, calculate unit economics, and pitch persuasively.',
    whoShouldChoose: 'Class 8–12 students, college founders, and professionals exploring business ideas.',
    durationOrTimeline: '8 Weeks (30 Live Hours + Demo Day)',
    pricingOrTier: '₹6,499 (incl. GST & Young Founder Certificate)',
    expectedOutcome:
      'Validated business canvas, unit economics model, working prototype, and live 10-slide Demo Day pitch.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Problem Discovery & Customer Interviews',
        detail: 'Identify high-pain problems and validate them with 10 real user interviews.',
      },
      {
        stepNumber: '02',
        title: 'No-Code / AI MVP Prototyping',
        detail: 'Turn your concept into a functional landing page or interactive prototype in days.',
      },
      {
        stepNumber: '03',
        title: 'Pricing, Revenue Model & Unit Economics',
        detail: 'Master CAC, LTV, gross margin, and break-even math.',
      },
      {
        stepNumber: '04',
        title: 'Demo Day Pitch Before Industry Founders',
        detail: 'Deliver a 5-minute investor-style pitch and receive founder feedback.',
      },
    ],
    keyHighlights: [
      'Mentored by 2x SaaS Founder & ISB Alumnus Karanveer Mehta',
      'Outstanding profile booster for Ivy League / IIM IPM / top college applications',
      'Develops real-world ownership mindset',
    ],
    faq: [
      {
        question: 'Do students need an existing startup idea before joining?',
        answer: 'No, Module 1 guides students through structured problem discovery to find a viable idea.',
      },
    ],
  },

  // ================= PILLAR 4: PARENT SERVICES =================
  'ps-counselling': {
    headline: 'Dedicated Parent Counselling & Generational Career Alignment',
    problemSolved:
      'Parents want security for their child, while students want autonomy and modern careers. Misalignment creates household tension during Class 10 and 12.',
    whoShouldChoose: 'Parents of Class 5 to UG students seeking objective, conflict-free career alignment.',
    durationOrTimeline: '45-Minute Joint & Dedicated Parent Consultation',
    pricingOrTier: '₹1,499 per Session',
    expectedOutcome:
      'Shared family career roadmap that respects the child’s natural aptitude while safeguarding financial stability.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Decoding Your Child’s Psychometric Profile',
        detail: 'Plain-language walkthrough of where your child naturally excels vs where pressure backfires.',
      },
      {
        stepNumber: '02',
        title: '2026–2035 Career Landscape Briefing',
        detail: 'Objective salary, stability, and growth data on emerging vs traditional careers.',
      },
      {
        stepNumber: '03',
        title: 'Bridging Parent Concerns & Student Aspirations',
        detail: 'Finds practical middle-ground pathways (e.g. Computational Economics, Design Engineering, FinTech).',
      },
      {
        stepNumber: '04',
        title: 'Stress-Free Home Academic Environment Plan',
        detail: 'Healthy milestone tracking without daily micromanagement.',
      },
    ],
    keyHighlights: [
      'Led by senior psychologists with 14+ years of family counselling experience',
      'Replaces dinner-table arguments with objective data',
      'Includes Parent Guidance Dossier',
    ],
    faq: [
      {
        question: 'Can parents book a session even before the child joins the call?',
        answer: 'Yes, parents can discuss their questions first and bring the student into the second half.',
      },
    ],
  },
  'ps-finance': {
    headline: 'Career Finance & Higher-Education Corpus Planning',
    problemSolved:
      'Higher education costs in India and abroad inflate at 8–10% annually. Waiting until Class 12 to plan tuition and hostel expenses forces families into high-interest loans.',
    whoShouldChoose: 'Parents of Class 5 to Class 12 students planning domestic or international university budgets.',
    durationOrTimeline: 'Interactive Corpus Calculator + Financial Roadmap Brief',
    pricingOrTier: 'Free Interactive Tool · Included in ₹1,999 Career Roadmap',
    expectedOutcome:
      'Exact inflation-adjusted higher-education corpus target and monthly provisioning plan.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Target Stream & Degree Cost Benchmarking',
        detail: 'Compares current 4/5-year costs across Engineering, Medicine, Law, Design, Management, and Study Abroad.',
      },
      {
        stepNumber: '02',
        title: 'Education Inflation Projection (3 to 10 Years)',
        detail: 'Calculates exact future rupee requirement when your child turns 18 or 21.',
      },
      {
        stepNumber: '03',
        title: 'Scholarship & Merit Aid Mapping',
        detail: 'Identifies national scholarships, institute fee waivers, and high-subsidy government institutes.',
      },
      {
        stepNumber: '04',
        title: 'Monthly Provisioning & Education Loan Comparison',
        detail: 'Calculates monthly SIP provisioning vs Section 80E education loan tax benefits.',
      },
    ],
    keyHighlights: [
      'Instant inflation-adjusted degree cost calculator built into Career360',
      'Compares Government vs Private vs International cost tiers',
      'Helps families avoid last-minute financial stress',
    ],
    faq: [
      {
        question: 'Where can I use the Career Finance calculator right now?',
        answer: 'Click the button below to open the interactive Higher-Education Corpus & ROI Calculator.',
      },
    ],
  },
  'ps-roi': {
    headline: 'Education ROI & Degree Payback Period Evaluation',
    problemSolved:
      'Some private degrees cost ₹25L–₹60L+ but deliver ₹5L–₹7L median placements, while certain public/autonomous institutes cost ₹2L–₹10L and deliver ₹12L–₹30L+ placements.',
    whoShouldChoose: 'Parents evaluating multiple college offers or comparing Indian vs overseas degrees.',
    durationOrTimeline: 'Instant ROI Calculator + College Comparison Matrix',
    pricingOrTier: 'Free Interactive Tool · Custom College ROI Audit Available',
    expectedOutcome:
      'Clear degree payback period (in years) comparing total tuition + hostel outlay against verified median starting CTC.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Total Program Outlay Calculation',
        detail: 'Aggregates tuition, hostel, living expenses, and opportunity cost.',
      },
      {
        stepNumber: '02',
        title: 'Verified Placement Median vs "Highest Package" Filtering',
        detail: 'Looks past marketing headlines to evaluate the 50th-percentile median salary.',
      },
      {
        stepNumber: '03',
        title: 'Payback Period & 5-Year Net Wealth Math',
        detail: 'Computes how many years of post-tax savings are needed to recover the degree cost.',
      },
      {
        stepNumber: '04',
        title: 'High-ROI Alternative Shortlisting',
        detail: 'Surfaces high-return colleges (e.g. SSCBS DU, IIITs, IDC IIT, ICT Mumbai, NITs) matching the student.',
      },
    ],
    keyHighlights: [
      'Protects families from low-ROI vanity university marketing',
      'Side-by-side College Fee vs Placement comparison',
      'Quantifies exact payback period in years',
    ],
    faq: [
      {
        question: 'Why do you use median salary instead of average or highest salary?',
        answer:
          'A single international offer can skew an "average" package, whereas median placement shows what the typical graduate actually earns.',
      },
    ],
  },
  'ps-workshops': {
    headline: 'Interactive Parent Workshops: NEP 2020, AI-Era Careers & Adolescent Motivation',
    problemSolved:
      'The career landscape has changed more in the last 5 years than in the previous 30. Parents need concise, jargon-free briefings on modern exams and AI-era careers.',
    whoShouldChoose: 'Parents, School PTA Associations, and Residential Communities.',
    durationOrTimeline: '60-Minute Live Interactive Conclave + Parent Q&A',
    pricingOrTier: 'Complimentary for Registered Parents & Partner Schools',
    expectedOutcome:
      'Up-to-date awareness of NEP 2020 subject flexibility, CUET/IPMAT/UCEED/CLAT rules, and healthy student motivation.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'The New Career Map (Beyond Just Doctor / Engineer)',
        detail: 'Explores 18 high-growth career categories and how AI is reshaping white-collar work.',
      },
      {
        stepNumber: '02',
        title: 'Demystifying NEP 2020 & Entrance Exams',
        detail: 'Clear guide to CUET, 4-year undergraduate honours, and interdisciplinary combinations.',
      },
      {
        stepNumber: '03',
        title: 'Supporting Teenagers Through Exam Seasons',
        detail: 'Psychological tools to keep students motivated, focused, and burnout-free.',
      },
      {
        stepNumber: '04',
        title: 'Live Open-Mic Q&A with Career Psychologists',
        detail: 'Direct answers to parent questions on stream, college, and skill choices.',
      },
    ],
    keyHighlights: [
      'Includes downloadable 2026 Career Handbook for Parents',
      'Hosted online every weekend and on-campus for partner schools',
      'Access child reports and feedback inside the Parent Dashboard',
    ],
    faq: [
      {
        question: 'How can our school PTA host a Career360 Parent Workshop?',
        answer: 'Use the School Partnership request form or switch to the Institution Admin workspace.',
      },
    ],
  },

  // ================= PILLAR 5: ENTREPRENEURSHIP =================
  'en-discovery': {
    headline: 'Business Discovery & Job-vs-Entrepreneurship Readiness Diagnostic',
    problemSolved:
      'Many students and professionals dream of starting a business, but aren’t sure whether to launch immediately, build industry experience first, or which business model fits their skills.',
    whoShouldChoose: 'Aspiring founders, students from business families, and working professionals.',
    durationOrTimeline: 'Founder Competency Diagnostic + Venture Opportunity Map',
    pricingOrTier: 'Included in Career360 AI Engine & Roadmap',
    expectedOutcome:
      'Objective evaluation of Job-vs-Business readiness, risk tolerance, and 3 matched venture models.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Founder Competency & Risk Appetite Assessment',
        detail: 'Evaluates ambiguity tolerance, sales communication, financial discipline, and execution grit.',
      },
      {
        stepNumber: '02',
        title: 'Job-First vs Direct-Venture Sequencing',
        detail: 'Determines whether 2–3 years of strategic corporate experience will 3x your startup odds.',
      },
      {
        stepNumber: '03',
        title: 'Service Agency vs Product SaaS vs D2C Matching',
        detail: 'Matches capital availability and technical skills to the right business model.',
      },
      {
        stepNumber: '04',
        title: 'Low-Risk Validation Blueprint',
        detail: 'How to test customer willingness-to-pay before spending heavy capital.',
      },
    ],
    keyHighlights: [
      'Honest, unglamorized evaluation of entrepreneurship vs employment',
      'Ideal for next-gen family business successors & first-gen founders',
      'Powered by AI Career Engine + Founder Mentors',
    ],
    faq: [
      {
        question: 'What if I want to join my family business after college?',
        answer:
          'We design a custom degree + 2-year external corporate exposure + digital transformation roadmap before you join the family enterprise.',
      },
    ],
  },
  'en-startup': {
    headline: '1-on-1 Startup Guidance, MVP Validation & Go-To-Market Mentorship',
    problemSolved:
      'First-time founders often spend months building features nobody wants or burn savings on unvalidated marketing.',
    whoShouldChoose: 'College founders, side-hustlers, and early-stage entrepreneurs.',
    durationOrTimeline: '1-on-1 Mentor Advisory + 90-Day GTM Sprint',
    pricingOrTier: '₹1,999 per Mentor Session',
    expectedOutcome:
      'Validated MVP scope, customer acquisition playbook, and unit-economics sanity check.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Problem-Solution Fit & ICP Definition',
        detail: 'Sharpens your Ideal Customer Profile (ICP) and core value proposition.',
      },
      {
        stepNumber: '02',
        title: 'Lean MVP Architecture',
        detail: 'Defines the smallest testable version of your product or service.',
      },
      {
        stepNumber: '03',
        title: 'First 10 Customers Go-To-Market Strategy',
        detail: 'Outbound, content, community, and partnership channels to win early revenue.',
      },
      {
        stepNumber: '04',
        title: 'Unit Economics & Pitch Deck Review',
        detail: 'Prepares your metrics and narrative for incubators, grants, or angel investors.',
      },
    ],
    keyHighlights: [
      'Direct mentorship from founders who have scaled real businesses',
      'Focuses on revenue and customer validation first',
      'Connects technical builders with commercial strategy',
    ],
    faq: [
      {
        question: 'Can college students book startup mentorship for campus incubator pitches?',
        answer: 'Yes, we regularly mentor student teams preparing for IIT/IIM E-Cell competitions and Startup India grants.',
      },
    ],
  },
  'en-yep': {
    headline: 'Young Entrepreneur Program (8-Week Experiential Founder Fellowship)',
    problemSolved:
      'Gives Class 8–12 and UG students a safe, structured environment to build a real micro-venture or prototype from scratch and pitch to industry leaders.',
    whoShouldChoose: 'Ambitious students in Class 8–12 and Undergraduate programs.',
    durationOrTimeline: '8 Weeks (Weekend Live Studios + Demo Day Showcase)',
    pricingOrTier: '₹6,499 Complete Fellowship',
    expectedOutcome:
      'Live prototype, validated business canvas, Demo Day pitch video, and Young Founder Fellowship Certificate.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Weeks 1–2: Opportunity Spotting & User Research',
        detail: 'Students interview real users to uncover a genuine everyday problem.',
      },
      {
        stepNumber: '02',
        title: 'Weeks 3–4: AI & No-Code Prototype Building',
        detail: 'Build a working web app, physical prototype, or digital service.',
      },
      {
        stepNumber: '03',
        title: 'Weeks 5–6: Brand Positioning, Pricing & P&L Math',
        detail: 'Calculate cost structure, pricing, and customer acquisition channels.',
      },
      {
        stepNumber: '04',
        title: 'Weeks 7–8: Pitch Rehearsal & Live Demo Day',
        detail: 'Present to a jury of entrepreneurs and educators to earn the Young Founder credential.',
      },
    ],
    keyHighlights: [
      'Standout achievement for holistic Indian & global university admissions',
      'Combines AI, Design, Finance, and Public Speaking in one capstone',
      'Builds lifelong leadership and problem-solving grit',
    ],
    faq: [
      {
        question: 'Can students participate in teams or individually?',
        answer: 'Students can build solo or in 2-person co-founder teams.',
      },
    ],
  },

  // ================= PILLAR 6: FOR SCHOOLS =================
  'fs-seminars': {
    headline: 'High-Impact Campus Career Awareness Seminars (Class 8 to 12 & Colleges)',
    problemSolved:
      'Students in most schools only know 5–7 conventional careers. Interactive campus seminars open their eyes to 150+ structured pathways and motivate academic focus.',
    whoShouldChoose: 'K-12 School Principals, Junior Colleges, and Undergraduate Institutions.',
    durationOrTimeline: '90-Minute Grade-Specific On-Campus or Virtual Conclave',
    pricingOrTier: 'Complimentary Introductory Seminar for Partner Schools',
    expectedOutcome:
      'Energized student batch with clear awareness of stream choices, entrance exams, and future skills.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Principal & Academic Coordinator Alignment',
        detail: 'Customizes seminar themes to your school’s board (CBSE/ICSE/IB/State) and batch profile.',
      },
      {
        stepNumber: '02',
        title: 'Interactive Visual Keynote by Senior Strategists',
        detail: 'Covers Career After 10th/12th, AI-era industry shifts, and non-traditional high-growth careers.',
      },
      {
        stepNumber: '03',
        title: 'Live Student Q&A & Myth-Busting',
        detail: 'Addresses live student questions on exams, subjects, and skill building.',
      },
      {
        stepNumber: '04',
        title: 'Complimentary Starter Assessment Access for Batch',
        detail: 'Every attending student receives a digital career starter profile link.',
      },
    ],
    keyHighlights: [
      'Zero coaching sales pitch — 100% educational career intelligence',
      'Separate tailored decks for Class 8–10 vs Class 11–12',
      'Post-seminar batch interest summary shared with the Principal',
    ],
    faq: [
      {
        question: 'How can a school book a free introductory career seminar?',
        answer: 'Click the button below to open the School Partnership Desk and log your preferred date.',
      },
    ],
  },
  'fs-annual': {
    headline: 'Annual School Career Guidance Program (NEP-2020 Compliant Career Cell)',
    problemSolved:
      'NEP 2020 emphasizes holistic career counselling and skill exposure from middle school onward, yet hiring a full-time team of psychologists and industry experts is expensive for individual schools.',
    whoShouldChoose: 'Progressive K-12 Schools and Autonomous Colleges seeking a turnkey year-round Career Cell.',
    durationOrTimeline: 'Full Academic Year Partnership (10-Month Calendar)',
    pricingOrTier: 'Custom Per-Student or Institutional Annual Tie-Up',
    expectedOutcome:
      'Fully operational Career360 Guidance Lab in your school with assessments, 1-on-1 counselling, parent orientations, and Principal analytics.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Quarter 1: Campus Orientation & Psychometric Drive',
        detail: 'Class-wise career assessments for Classes 5 through 12.',
      },
      {
        stepNumber: '02',
        title: 'Quarter 2: Individual Career Reports & Stream Triaging',
        detail: 'Every student and parent receives their personalized digital Career Profile.',
      },
      {
        stepNumber: '03',
        title: 'Quarter 3: 1-on-1 Counselling Desk & Parent Conclaves',
        detail: 'Dedicated counsellors conduct stream-locking and college-shortlisting sessions.',
      },
      {
        stepNumber: '04',
        title: 'Quarter 4: Skill Workshops & Principal Annual Audit',
        detail: 'Applied AI, Communication & Financial Literacy bootcamps + Board/Management report.',
      },
    ],
    keyHighlights: [
      'Complete NEP 2020 & CBSE/ICSE career guidance compliance',
      'Enhances school brand positioning with parents during admissions',
      'Dedicated Career360 Institutional Account Manager',
    ],
    faq: [
      {
        question: 'Can the program be white-labeled with our school crest?',
        answer: 'Yes, student reports and parent portals co-brand your institution’s name and logo.',
      },
    ],
  },
  'fs-assessment': {
    headline: 'Institutional Batch Career Assessment Drive (Class 5 to 12)',
    problemSolved:
      'Enables schools to evaluate 100 to 2,000+ students in a single computer-lab or tablet drive and generate instant individual + batch-level aptitude heatmaps.',
    whoShouldChoose: 'Schools wanting data-backed stream allocation in Class 10 and college readiness tracking in Class 12.',
    durationOrTimeline: '1-Week Campus Lab Drive + Instant Principal Analytics',
    pricingOrTier: 'Institutional Bulk Tier Pricing',
    expectedOutcome:
      'Individual 14-dimension Career Profile for every student + Class-wise Stream & Aptitude Distribution Report for the Principal.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Bulk Roster Upload & Class Slot Scheduling',
        detail: 'Seamless onboarding of student sections from Class 5 to 12.',
      },
      {
        stepNumber: '02',
        title: 'Supervised Computer Lab / Home Assessment Drive',
        detail: '40-minute cohort-calibrated testing with live completion tracking.',
      },
      {
        stepNumber: '03',
        title: 'Automated Student & Parent Report Distribution',
        detail: 'Instant digital PDF reports delivered to parents.',
      },
      {
        stepNumber: '04',
        title: 'Principal Batch Heatmap & Counsellor Triaging',
        detail: 'Identifies how many students fit Science, Commerce, Humanities, and emerging clusters.',
      },
    ],
    keyHighlights: [
      'Zero administrative burden on school teachers',
      'Identifies gifted students and those needing communication/aptitude support',
      'Exportable batch CSV/PDF reports for school management',
    ],
    faq: [
      {
        question: 'How many students can take the assessment simultaneously?',
        answer: 'Our cloud architecture supports 1,000+ concurrent student sessions without lag.',
      },
    ],
  },
  'fs-parent': {
    headline: 'School Parent Programs & PTA Stream Selection Conclaves',
    problemSolved:
      'Schools often face pressure from parents during Class 11 stream allocation. Objective expert-led PTA conclaves build deep parent trust in the school’s academic leadership.',
    whoShouldChoose: 'School Principals and Management hosting Class 8–10 or Class 11–12 parent orientations.',
    durationOrTimeline: '60–90 Minute PTA Conclave + 1-on-1 Parent Helpdesk',
    pricingOrTier: 'Included in Institutional Partnerships',
    expectedOutcome:
      'Aligned parent community with clear understanding of stream choices, entrance exams, and school guidance support.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Pre-Conclave Parent Survey',
        detail: 'Collects top parent questions and anxieties ahead of the PTA event.',
      },
      {
        stepNumber: '02',
        title: 'Expert Keynote on Future Careers & Stream Fit',
        detail: 'Data-backed presentation showing why aptitude fit beats peer pressure.',
      },
      {
        stepNumber: '03',
        title: 'Walkthrough of Student Psychometric Reports',
        detail: 'Teaches parents how to read their child’s 14-dimension Career360 report.',
      },
      {
        stepNumber: '04',
        title: 'On-Campus 1-on-1 Parent Counselling Desk',
        detail: 'Individual slot consultations for families needing personalized guidance.',
      },
    ],
    keyHighlights: [
      'Positions your school as a forward-thinking future-readiness partner',
      'Reduces Class 11 stream-switch requests by over 70%',
      'Bilingual delivery (English + Regional Language)',
    ],
    faq: [
      {
        question: 'Can this be conducted on a Saturday morning alongside PTM?',
        answer: 'Yes, Saturday PTM integration achieves the highest parent turnout.',
      },
    ],
  },
  'fs-studentdev': {
    headline: 'In-School Student Skill Development Bootcamps (AI, Communication, Finance)',
    problemSolved:
      'Integrates practical 21st-century skill modules directly into the school calendar without overloading regular teachers.',
    whoShouldChoose: 'K-12 Schools and Colleges wanting hands-on AI, English Speaking, Financial Literacy, or Entrepreneurship labs.',
    durationOrTimeline: '12-to-24 Hour Modular Campus / Hybrid Bootcamps',
    pricingOrTier: 'Institutional Workshop & Co-Curricular Packages',
    expectedOutcome:
      'Students build real projects and present them at an on-campus Career & Innovation Exhibition.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Grade-Wise Skill Track Selection',
        detail: 'e.g., Spoken English for Class 5–7, Financial Literacy for Class 8, Applied AI & Entrepreneurship for Class 9–12.',
      },
      {
        stepNumber: '02',
        title: 'Trainer-Led Experiential Lab Sessions',
        detail: 'Interactive workshops with workbooks, group challenges, and digital tools.',
      },
      {
        stepNumber: '03',
        title: 'Student Capstone Project Creation',
        detail: 'Students build tangible outputs (speeches, AI workflows, budgets, startup pitches).',
      },
      {
        stepNumber: '04',
        title: 'Campus Showcase & Co-Branded Certification',
        detail: 'Certificates jointly signed by your School Principal and Career360 by Bytezen.',
      },
    ],
    keyHighlights: [
      'Aligned with NEP 2020 vocational and 21st-century skill mandates',
      'Includes trained industry facilitators and curriculum kits',
      'Culminates in a parent-facing Student Innovation Showcase',
    ],
    faq: [
      {
        question: 'Can these workshops run during summer/winter camps or zero periods?',
        answer: 'Yes, we support both weekly zero-period integration and intensive vacation bootcamps.',
      },
    ],
  },
  'fs-dashboard': {
    headline: 'School Career Dashboard (Principal & Management Intelligence Console)',
    problemSolved:
      'Gives school leadership real-time visibility into student career readiness, assessment completion, stream distribution, and counselling outcomes across all grades.',
    whoShouldChoose: 'School Principals, Trustees, Deans, and Career Cell Coordinators.',
    durationOrTimeline: '24/7 Cloud Dashboard with Role-Based Access',
    pricingOrTier: 'Included for All Partner Schools & Colleges',
    expectedOutcome:
      'Centralized institutional analytics tracking every student from Class 5 through Class 12 college placement.',
    roadmapSteps: [
      {
        stepNumber: '01',
        title: 'Batch & Section Readiness Overview',
        detail: 'Live metrics on how many students in each grade have completed assessments and counselling.',
      },
      {
        stepNumber: '02',
        title: 'Stream & Career Cluster Distribution Analytics',
        detail: 'Visual breakdown of student aptitude across STEM, Commerce, Healthcare, Design, Law, and AI.',
      },
      {
        stepNumber: '03',
        title: 'Counselling & Workshop Outcome Logs',
        detail: 'Tracks 1-on-1 sessions held, parent attendance, and skill certifications earned.',
      },
      {
        stepNumber: '04',
        title: 'One-Click Accreditation & Board Reports',
        detail: 'Export institutional career guidance reports for CBSE/ICSE/NAAC/NEP inspections.',
      },
    ],
    keyHighlights: [
      'Strict student data privacy & role-based access control (RBAC)',
      'Live preview available right now in the Institution Admin Workspace',
      'Tracks multi-year longitudinal student growth',
    ],
    faq: [
      {
        question: 'Can I preview the live School Career Dashboard right now?',
        answer: 'Yes! Click "Open School Career Dashboard" below to jump directly into the Principal Console.',
      },
    ],
  },
};
