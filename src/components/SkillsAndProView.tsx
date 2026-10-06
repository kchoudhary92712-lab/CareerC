import React, { useMemo, useState } from 'react';
import {
  Award,
  Briefcase,
  CheckCircle2,
  Clock,
  RefreshCw,
  Rocket,
  Sparkles,
  Users,
} from 'lucide-react';
import { SkillCourseRecord, UserAccount } from '../types/platform';

interface SkillsAndProViewProps {
  initialCategory?: string;
  courses: SkillCourseRecord[];
  currentUser: UserAccount;
  onEnrollCourse: (course: SkillCourseRecord) => void;
  onBookMentor: () => void;
}

interface AiCareerAnalysis {
  executiveInterpretation: string;
  recommendedPathways: {
    title: string;
    fitIndicator: string;
    whyItFits: string;
    targetCollegesOrExams: string;
  }[];
  skillGapAnalysis: {
    skill: string;
    currentLevel: string;
    recommendedAction: string;
  }[];
  jobVsBusinessGuidance: string;
  ninetyDayRoadmap: string[];
  counsellorValidationNote: string;
}

export const SkillsAndProView: React.FC<SkillsAndProViewProps> = ({
  initialCategory = 'ALL',
  courses,
  currentUser,
  onEnrollCourse,
  onBookMentor,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory === 'entrepreneurship-hub' ? 'Entrepreneurship' : initialCategory
  );
  const [activeSubSection, setActiveSubSection] = useState<'courses' | 'pro' | 'ai'>(
    initialCategory === 'entrepreneurship-hub' ? 'pro' : 'courses'
  );

  // Working Professional & Entrepreneurship Roadmap state
  const [proCurrentRole, setProCurrentRole] = useState<string>(
    currentUser.currentRole || 'Software / QA Engineer (4 Yrs Exp)'
  );
  const [proTargetRole, setProTargetRole] = useState<string>(
    currentUser.targetRole || 'AI Product Manager / SaaS Founder'
  );
  const [proCurrentCtc, setProCurrentCtc] = useState<string>(
    currentUser.salaryBand || '₹11.5 LPA'
  );
  const [proTrackType, setProTrackType] = useState<
    'Career Pivot & Upskilling' | 'Salary & Promotion Acceleration' | 'Entrepreneurship & Venture Launch'
  >('Career Pivot & Upskilling');

  // AI Career Engine state (Phase 16)
  const [aiCohort, setAiCohort] = useState<string>(currentUser.cohort || 'Class 11-12');
  const [aiSkills, setAiSkills] = useState<string>(
    'PCM, Python, Analytical Problem Solving, Communication'
  );
  const [aiInterests, setAiInterests] = useState<string>(
    'Applied AI, FinTech, Product Engineering & Entrepreneurship'
  );
  const [aiGoal, setAiGoal] = useState<string>('Job vs Business Fit & 5-Year Career Roadmap');
  const [aiQuestion, setAiQuestion] = useState<string>(
    'What are the best high-growth career clusters, skill gaps to close, and 90-day milestones for my profile?'
  );
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AiCareerAnalysis | null>({
    executiveInterpretation:
      'Based on your profile in PCM, Python, and Analytical Problem Solving with interests in Applied AI and FinTech, your profile shows high alignment with AI Systems Engineering and Technical Product Strategy. Combining domain depth with executive communication will maximize both placement and entrepreneurial optionality.',
    recommendedPathways: [
      {
        title: 'AI & Machine Learning Systems Engineering',
        fitIndicator: 'Suggested High Fit (92% Alignment)',
        whyItFits: 'Leverages quantitative reasoning and Python foundation for high-demand intelligent software roles.',
        targetCollegesOrExams: 'JEE Main & Advanced · IIIT-H UGEE · BITSAT · IIT Madras BS',
      },
      {
        title: 'FinTech & Quantitative Product Strategy',
        fitIndicator: 'Potential Fit (88% Alignment)',
        whyItFits: 'Connects algorithmic thinking with capital markets, payments, and product management.',
        targetCollegesOrExams: 'IPMAT · CUET (SSCBS) · CFA + B.Tech / Economics',
      },
    ],
    skillGapAnalysis: [
      {
        skill: 'Applied LLM & Workflow Automation',
        currentLevel: 'Foundational',
        recommendedAction: 'Complete Career360 Applied Generative AI Lab & ship 2 documented GitHub projects.',
      },
      {
        skill: 'Executive Public Speaking & Pitching',
        currentLevel: 'Developing',
        recommendedAction: 'Practice structured Pyramid-Principle articulation in the Executive English Lab.',
      },
    ],
    jobVsBusinessGuidance:
      'Build high-leverage product and engineering execution in a fast-growing technology team for the first 2–3 years while validating micro-SaaS or problem prototypes alongside mentors.',
    ninetyDayRoadmap: [
      'Days 1–30: Lock primary & backup academic/career tracks with a certified Career360 counsellor.',
      'Days 31–60: Complete one hands-on skill capstone (Applied AI or Executive English) to build verifiable proof of work.',
      'Days 61–90: Finalize college/role shortlist and review 5-year Education ROI with family.',
    ],
    counsellorValidationNote:
      'Guidance Notice: AI-assisted recommendations represent suggested pathways for exploration and are not guaranteed outcomes. Always validate major academic or career decisions with a certified Career360 counsellor.',
  });

  const categories = useMemo(() => {
    const list = [
      'ALL',
      'AI',
      'English Speaking',
      'Coding',
      'Digital Marketing',
      'Financial Literacy',
      'Entrepreneurship',
    ];
    return list;
  }, []);

  const filteredCourses = useMemo(() => {
    if (selectedCategory === 'ALL') return courses;
    return courses.filter(
      (c) => c.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [courses, selectedCategory]);

  const handleRunAiAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/career-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cohort: aiCohort,
          currentSkillsOrSubjects: aiSkills,
          interests: aiInterests,
          goalType: aiGoal,
          customQuestion: aiQuestion,
        }),
      });
      const data = await res.json();
      if (data?.analysis) {
        setAiResult(data.analysis);
      }
    } catch (err) {
      console.error('AI Advisor error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="py-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Sub-Section Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-[#0F766E] mb-1">
            Phase 12, 13 & 16 · Skill Development Marketplace, Working Professionals & AI Career Engine
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Future-Ready Skill Courses, Career Pivot & AI Advisor
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Convert career clarity into real-world capabilities across English speaking, Applied AI, Coding, Finance, and Entrepreneurship.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
          <button
            type="button"
            onClick={() => setActiveSubSection('courses')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeSubSection === 'courses'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Skill Course Marketplace
          </button>
          <button
            type="button"
            onClick={() => setActiveSubSection('pro')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeSubSection === 'pro'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Working Pros & Entrepreneurship
          </button>
          <button
            type="button"
            onClick={() => setActiveSubSection('ai')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeSubSection === 'ai'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            AI Career & Skill-Gap Engine
          </button>
        </div>
      </div>

      {/* SECTION 1: SKILL COURSE MARKETPLACE */}
      {activeSubSection === 'courses' && (
        <div className="mt-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#0D3B49] text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'ALL' ? 'All Skill Programs' : cat}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Recommendation Flow: Career Profile → Skill Gap → Recommended Skill Course → Capstone Portfolio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isEnrolled = currentUser.enrolledCourseIds.includes(course.id);
              return (
                <div
                  key={course.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <span className="font-semibold text-[#0F766E]">{course.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{course.duration}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">Max {course.batchSize}/Batch</span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 mb-2">{course.title}</h2>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {course.overview}
                    </p>

                    <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-slate-100 mb-4 text-xs">
                      <p className="font-bold text-slate-900 mb-1.5">Structured Curriculum:</p>
                      <ul className="space-y-1 text-slate-600">
                        {course.curriculum.map((mod, idx) => (
                          <li key={idx} className="truncate">
                            • {mod}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <p>
                        <strong className="text-slate-900">Lead Trainer:</strong>{' '}
                        {course.trainerName} ({course.trainerCredentials})
                      </p>
                      <p>
                        <strong className="text-slate-900">Schedule:</strong> {course.schedule}
                      </p>
                      <p>
                        <strong className="text-slate-900">Outcome:</strong> {course.outcomes}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
                    <div>
                      <span className="block text-xs text-slate-500">Program Fee (incl. GST)</span>
                      <span className="text-lg font-bold font-mono tabular-nums text-slate-900">
                        ₹{course.feesInr.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {isEnrolled ? (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#F0FDFA] text-[#0F766E] text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        Enrolled in Batch
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onEnrollCourse(course)}
                        className="px-4 py-2.5 rounded-lg bg-[#0F766E] text-white text-xs font-semibold hover:bg-[#115E59] transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Enroll / Book Demo
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: WORKING PROFESSIONAL PLATFORM & ENTREPRENEURSHIP HUB */}
      {activeSubSection === 'pro' && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-xs font-semibold text-[#D94826] mb-1">
              Phase 13 & Pillar 5 · Working Professionals & Entrepreneurship
            </p>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Configure Your Career Growth or Venture Roadmap
            </h2>
            <p className="text-xs text-slate-600 mb-6">
              Tailored for professionals with 1–15+ years experience seeking career switches, salary acceleration, or startup validation.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="pro-current" className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Role & Experience
                </label>
                <input
                  id="pro-current"
                  type="text"
                  value={proCurrentRole}
                  onChange={(e) => setProCurrentRole(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-[#F8FAFC] border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label htmlFor="pro-target" className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Role or Venture Concept
                </label>
                <input
                  id="pro-target"
                  type="text"
                  value={proTargetRole}
                  onChange={(e) => setProTargetRole(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-[#F8FAFC] border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label htmlFor="pro-ctc" className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Compensation / Capital Band
                </label>
                <input
                  id="pro-ctc"
                  type="text"
                  value={proCurrentCtc}
                  onChange={(e) => setProCurrentCtc(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-mono bg-[#F8FAFC] border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Primary Strategic Track
                </label>
                <div className="space-y-2">
                  {(
                    [
                      'Career Pivot & Upskilling',
                      'Salary & Promotion Acceleration',
                      'Entrepreneurship & Venture Launch',
                    ] as const
                  ).map((track) => (
                    <button
                      key={track}
                      type="button"
                      onClick={() => setProTrackType(track)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                        proTrackType === track
                          ? 'bg-[#0D3B49] text-white border-[#0D3B49]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {track}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={onBookMentor}
                className="w-full py-3 px-4 rounded-lg bg-[#0F766E] text-white text-xs font-semibold hover:bg-[#115E59] transition-colors cursor-pointer"
              >
                Book 1-on-1 Executive Strategist Session
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
            <div className="pb-5 border-b border-slate-200">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span>Generated Output</span>
                <span aria-hidden="true">·</span>
                <span>{proTrackType}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Professional Career Growth Roadmap: {proCurrentRole} → {proTargetRole}
              </h3>
            </div>

            <div className="space-y-6 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-[#F8FAFC] border border-slate-200 text-xs">
                <div>
                  <span className="block text-slate-500">Current Baseline</span>
                  <span className="font-bold font-mono text-slate-900">{proCurrentCtc}</span>
                </div>
                <div>
                  <span className="block text-slate-500">Target Transition Window</span>
                  <span className="font-bold font-mono text-[#0F766E]">16 – 24 Weeks</span>
                </div>
                <div>
                  <span className="block text-slate-500">Core Leverage Pillar</span>
                  <span className="font-bold text-slate-900">AI Workflow + Domain Proof</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    Stage 1 (Weeks 1–6): Skill-Gap Elimination & AI Augmentation
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Bridge the competency delta between <strong>{proCurrentRole}</strong> and{' '}
                    <strong>{proTargetRole}</strong> by building 2 real-world case studies combining domain operations with AI workflow automation and product metrics.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    Stage 2 (Weeks 7–12): Resume, LinkedIn & Proof-of-Work Positioning
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Restructure your resume and LinkedIn profile around quantified business outcomes rather than task descriptions. Publish your capstone teardown to attract inbound hiring managers or early customers.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    Stage 3 (Weeks 13–20): Interview Simulation, Negotiation or MVP Revenue
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Execute targeted referrals, executive mock interviews, and compensation structure evaluation—or validate your first 10 paying customers in the Career360 Entrepreneurship Track.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: PHASE 16 — AI CAREER ENGINE */}
      {activeSubSection === 'ai' && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form
            onSubmit={handleRunAiAdvisor}
            className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-4 self-start"
          >
            <div>
              <p className="text-xs font-semibold text-[#0F766E] mb-1">
                Phase 16 · Server-Side Gemini AI Career Engine
              </p>
              <h2 className="text-xl font-bold text-slate-900">
                AI Career & Skill-Gap Analyzer
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Synthesizes your academic/professional profile against our Career Database to generate structured guidance for counsellor validation.
              </p>
            </div>

            <div>
              <label htmlFor="ai-cohort" className="block text-xs font-semibold text-slate-700 mb-1">
                Student / Professional Cohort
              </label>
              <select
                id="ai-cohort"
                value={aiCohort}
                onChange={(e) => setAiCohort(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-[#F8FAFC] border border-slate-300 rounded-lg"
              >
                <option value="Class 5-6">Class 5-6</option>
                <option value="Class 7-8">Class 7-8</option>
                <option value="Class 9-10">Class 9-10</option>
                <option value="Class 11-12">Class 11-12</option>
                <option value="UG">UG Student</option>
                <option value="PG">PG Student</option>
                <option value="Working Professionals">Working Professional</option>
              </select>
            </div>

            <div>
              <label htmlFor="ai-skills" className="block text-xs font-semibold text-slate-700 mb-1">
                Current Subjects / Skills
              </label>
              <input
                id="ai-skills"
                type="text"
                value={aiSkills}
                onChange={(e) => setAiSkills(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-[#F8FAFC] border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="ai-interests" className="block text-xs font-semibold text-slate-700 mb-1">
                Core Interests & Curiosity Areas
              </label>
              <input
                id="ai-interests"
                type="text"
                value={aiInterests}
                onChange={(e) => setAiInterests(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-[#F8FAFC] border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="ai-question" className="block text-xs font-semibold text-slate-700 mb-1">
                Specific Career Dilemma or Question
              </label>
              <textarea
                id="ai-question"
                rows={3}
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-[#F8FAFC] border border-slate-300 rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={aiLoading}
              className="w-full py-3 px-4 rounded-lg bg-[#0F766E] text-white text-xs font-semibold hover:bg-[#115E59] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              {aiLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Career Intelligence...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Career & Skill-Gap Analysis</span>
                </>
              )}
            </button>
          </form>

          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
            {aiResult && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">
                    AI Career Engine Output · Validated against Career360 Intelligence Schema
                  </p>
                  <h3 className="text-xl font-bold text-slate-900">
                    Personalized Career Interpretation & Skill-Gap Blueprint
                  </h3>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {aiResult.executiveInterpretation}
                </p>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-3">
                    01. Suggested Career Pathways & Target Exams
                  </h4>
                  <div className="space-y-3">
                    {aiResult.recommendedPathways.map((p, idx) => (
                      <div key={idx} className="p-4 rounded-lg bg-[#F8FAFC] border border-slate-200">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-bold text-slate-900">{p.title}</span>
                          <span className="text-xs font-semibold text-[#0F766E]">
                            {p.fitIndicator}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mb-1.5">{p.whyItFits}</p>
                        <p className="text-xs font-medium text-slate-800">
                          Target Exams / Institutes: {p.targetCollegesOrExams}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-3">
                    02. Skill-Gap Analysis & Recommended Action
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {aiResult.skillGapAnalysis.map((sg, idx) => (
                      <div key={idx} className="p-3.5 rounded-lg border border-slate-200 text-xs">
                        <p className="font-bold text-slate-900">{sg.skill}</p>
                        <p className="text-slate-500 my-1">Current Level: {sg.currentLevel}</p>
                        <p className="text-[#0F766E] font-medium">{sg.recommendedAction}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1.5">
                      03. Job vs Entrepreneurship Guidance
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      {aiResult.jobVsBusinessGuidance}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1.5">04. 90-Day Execution Plan</h4>
                    <ul className="space-y-1.5 text-slate-700">
                      {aiResult.ninetyDayRoadmap.map((step, i) => (
                        <li key={i}>• {step}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  {aiResult.counsellorValidationNote}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
