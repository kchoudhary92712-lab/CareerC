import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Download,
  FileText,
  Lock,
  Printer,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { ASSESSMENT_QUESTIONS } from '../data/seedData';
import {
  CohortStage,
  ReportProduct,
  StudentCareerProfile,
  UserAccount,
} from '../types/platform';

const COHORT_STAGES: CohortStage[] = [
  'Class 5-6',
  'Class 7-8',
  'Class 9-10',
  'Class 11-12',
  'UG',
  'PG',
  'Working Professionals',
];

const COHORT_DESCRIPTIONS: Record<CohortStage, string> = {
  'Class 5-6': 'Multiple-intelligence curiosity check, foundational learning habits, and communication confidence.',
  'Class 7-8': 'Pre-high-school aptitude discovery, subject affinity mapping, and co-curricular skill orientation.',
  'Class 9-10': 'Scientific stream & subject combination selection (PCM, PCB, Commerce, Humanities, Interdisciplinary).',
  'Class 11-12': 'Degree & entrance exam roadmap (JEE, NEET, CUET, CLAT, UCEED, IPMAT) + Tier-1 college shortlisting.',
  UG: 'Specialization clarity, campus placement vs higher education (MBA/MS/GATE), and employability skill gaps.',
  PG: 'Domain mastery, R&D vs corporate leadership trajectory, and high-growth industry targeting.',
  'Working Professionals': 'Mid-career pivot, AI-era upskilling, salary-growth roadmap, and Job-vs-Business readiness.',
};

interface AssessmentEngineProps {
  initialCohort?: CohortStage;
  currentUser: UserAccount;
  profiles: StudentCareerProfile[];
  reportProducts: ReportProduct[];
  onSubmitAssessment: (payload: {
    userId: string;
    studentName: string;
    cohort: CohortStage;
    academicNotes: string;
    answers: { score: number; clusterTag: string; strengthTag: string }[];
  }) => Promise<StudentCareerProfile | null>;
  onPurchaseReport: (report: ReportProduct) => void;
  onBookCounselling: () => void;
}

export const AssessmentEngine: React.FC<AssessmentEngineProps> = ({
  initialCohort = 'Class 11-12',
  currentUser,
  profiles,
  reportProducts,
  onSubmitAssessment,
  onPurchaseReport,
  onBookCounselling,
}) => {
  const [selectedCohort, setSelectedCohort] = useState<CohortStage>(initialCohort);
  const [studentName, setStudentName] = useState<string>(currentUser.name || 'Aarav Kulkarni');
  const [academicNotes, setAcademicNotes] = useState<string>(
    '89% Aggregate · Seeking structured career clarity & skill roadmap'
  );
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedOptionIndices, setSelectedOptionIndices] = useState<Record<string, number>>({
    'q-academic': 0,
    'q-aptitude': 0,
    'q-tech-ai': 0,
    'q-communication': 0,
    'q-entrepreneurship': 1,
    'q-work-pref': 0,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeProfile, setActiveProfile] = useState<StudentCareerProfile>(
    profiles[0]
  );
  const [viewMode, setViewMode] = useState<'quiz' | 'profile'>('quiz');

  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const activeQuestion = ASSESSMENT_QUESTIONS[currentStep];
  const progressPct = Math.round(((currentStep + 1) / totalQuestions) * 100);

  const handleSelectOption = (qId: string, optionIdx: number) => {
    setSelectedOptionIndices((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleFinishAssessment = async () => {
    setIsSubmitting(true);
    try {
      const compiledAnswers = ASSESSMENT_QUESTIONS.map((q) => {
        const idx = selectedOptionIndices[q.id] ?? 0;
        return q.options[idx] || q.options[0];
      });
      const created = await onSubmitAssessment({
        userId: currentUser.id,
        studentName: studentName.trim() || currentUser.name,
        cohort: selectedCohort,
        academicNotes,
        answers: compiledAnswers,
      });
      if (created) {
        setActiveProfile(created);
      }
      setViewMode('profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-[#0F766E] mb-1">
            Phase 3 & 4 · Psychometric Career Assessment & Digital Report Engine
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Multi-Cohort Career Assessment & Student Profile
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Scientifically structured across 14 dimensions with stage-specific scoring for Class 5 through Working Professionals.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
          <button
            type="button"
            onClick={() => setViewMode('quiz')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              viewMode === 'quiz'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Take Career Assessment
          </button>
          <button
            type="button"
            onClick={() => setViewMode('profile')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              viewMode === 'profile'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. View Student Career Profile & Reports
          </button>
        </div>
      </div>

      {/* Cohort Selector Bar */}
      <div className="mt-6 mb-8">
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Select Target Cohort Version (5th → 6th → 7th → 8th → 9th → 10th → 11th → 12th → UG → PG → Career):
        </label>
        <div className="flex flex-wrap gap-2">
          {COHORT_STAGES.map((stage) => (
            <button
              key={stage}
              type="button"
              onClick={() => {
                setSelectedCohort(stage);
                setCurrentStep(0);
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                selectedCohort === stage
                  ? 'bg-[#0D3B49] text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">
          <span className="font-semibold text-slate-700">{selectedCohort} Focus:</span>{' '}
          {COHORT_DESCRIPTIONS[selectedCohort]}
        </p>
      </div>

      {viewMode === 'quiz' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Active Question Card */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-100">
              <div className="text-xs text-slate-500">
                <span className="font-semibold text-[#0F766E]">
                  Dimension {currentStep + 1} of {totalQuestions}
                </span>
                <span aria-hidden="true"> · </span>
                <span>{activeQuestion.category}</span>
                <span aria-hidden="true"> · </span>
                <span>Auto-Saved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0F766E] transition-all duration-200"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="text-xs font-mono tabular-nums font-semibold text-slate-700">
                  {progressPct}%
                </span>
              </div>
            </div>

            {/* Candidate Info Quick Bar on Step 0 */}
            {currentStep === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <label htmlFor="assessment-student-name" className="block text-xs font-medium text-slate-700 mb-1">
                    Student / Candidate Name
                  </label>
                  <input
                    id="assessment-student-name"
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  />
                </div>
                <div>
                  <label htmlFor="assessment-academic-snapshot" className="block text-xs font-medium text-slate-700 mb-1">
                    Current Academic / Role Snapshot
                  </label>
                  <input
                    id="assessment-academic-snapshot"
                    type="text"
                    value={academicNotes}
                    onChange={(e) => setAcademicNotes(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  />
                </div>
              </div>
            )}

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-6">
              {activeQuestion.prompt}
            </h2>

            <div className="space-y-3">
              {activeQuestion.options.map((opt, idx) => {
                const isSelected = (selectedOptionIndices[activeQuestion.id] ?? 0) === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(activeQuestion.id, idx)}
                    className={`w-full text-left p-4 rounded-lg border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-[#0F766E] bg-[#F0FDFA] text-slate-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono mt-0.5 shrink-0 ${
                        isSelected
                          ? 'bg-[#0F766E] text-white font-semibold'
                          : 'border border-slate-300 text-slate-500'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{opt.label}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Maps to: {opt.clusterTag} · Indicator: {opt.strengthTag}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
              <button
                type="button"
                disabled={currentStep === 0}
                onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                className="px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 cursor-pointer whitespace-nowrap"
              >
                Previous Question
              </button>

              <div className="flex items-center gap-3">
                {currentStep < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((s) => Math.min(totalQuestions - 1, s + 1))}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#0D3B49] rounded-lg hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>Save & Next Dimension</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : null}

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinishAssessment}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#0F766E] rounded-lg hover:bg-[#115E59] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Calculating Career Profile...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Student Career Profile</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Assessment Methodology & Responsible Guidance Notice */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-base font-bold text-slate-900 mb-2">
                14-Dimension Assessment Architecture
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Unlike generic aptitude tests that only test math speed, Career360 evaluates holistic future-readiness:
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                  <span>Academic Profile & Subject Affinity</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                  <span>Analytical Aptitude & Systems Thinking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                  <span>Personality, Work & Learning Preferences</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                  <span>Communication Confidence & Technology Fluency</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                  <span>Entrepreneurship & Financial Awareness</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#FFFBEB] rounded-xl border border-amber-200 p-5">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900 mb-1">
                    Ethical Career Guidance Standard
                  </h4>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Automated assessment results are presented as <strong>Suggested</strong> pathways and <strong>Potential fit</strong> areas for exploration. We always recommend combining psychometric data with 1-on-1 human counsellor validation before final stream or degree lock-in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* STUDENT CAREER PROFILE & REPORT TIERS VIEW */
        <div className="space-y-10">
          {/* Generated Student Career Profile Document */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span>Student Career Profile</span>
                  <span aria-hidden="true">·</span>
                  <span>Cohort: {activeProfile.cohort}</span>
                  <span aria-hidden="true">·</span>
                  <span>Generated: {activeProfile.completedAt}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {activeProfile.studentName} — Holistic Career Readiness Profile
                </h2>
                <p className="text-xs text-slate-600 mt-1">{activeProfile.academicSnapshot}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right pr-3 border-r border-slate-200">
                  <span className="block text-xs text-slate-500">Readiness Index</span>
                  <span className="text-2xl font-bold font-mono tabular-nums text-[#0F766E]">
                    {activeProfile.overallReadinessIndex}/100
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer whitespace-nowrap"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={onBookCounselling}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0F766E] rounded-lg hover:bg-[#115E59] cursor-pointer whitespace-nowrap"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Validate with Counsellor</span>
                </button>
              </div>
            </div>

            {/* Dimension Scores & Suggested Career Clusters */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
              <div className="lg:col-span-6">
                <h3 className="text-sm font-bold text-slate-900 mb-4">
                  01. Psychometric & Competency Dimension Breakdown
                </h3>
                <div className="space-y-4">
                  {activeProfile.dimensionScores.map((dim, idx) => (
                    <div key={idx} className="pb-3 border-b border-slate-100 last:border-b-0">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
                        <span>{dim.dimension}</span>
                        <span className="font-mono tabular-nums text-[#0F766E]">{dim.score}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-1.5">
                        <div
                          className="h-full bg-[#0D3B49] rounded-full"
                          style={{ width: `${dim.score}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500">{dim.interpretation}</p>
                    </div>
                  ))}
                </div>

                {/* Strengths & Development Areas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-2">Observed Core Strengths</h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {activeProfile.strengths.map((st, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0 mt-0.5" />
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-2">Priority Development Areas</h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {activeProfile.developmentAreas.map((dev, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <ArrowRight className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{dev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <h3 className="text-sm font-bold text-slate-900 mb-4">
                  02. Suggested Career Clusters & Potential Fit
                </h3>
                <div className="space-y-4">
                  {activeProfile.suggestedClusters.map((cluster, idx) => (
                    <div key={idx} className="p-4 rounded-lg border border-slate-200 bg-[#F8FAFC]">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-sm font-bold text-slate-900">{cluster.clusterName}</h4>
                        <span className="text-xs font-semibold text-[#0F766E]">
                          {cluster.fitLevel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-2.5">{cluster.rationale}</p>
                      <p className="text-xs text-slate-700">
                        <span className="font-semibold">Explore Careers: </span>
                        {cluster.sampleCareers.join(' · ')}
                      </p>
                    </div>
                  ))}
                </div>

                {/* 90-Day Action Plan */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 mb-3">
                    03. Recommended 90-Day Action Plan
                  </h4>
                  <div className="space-y-2.5">
                    {activeProfile.ninetyDayActionPlan.map((step, i) => (
                      <div key={i} className="text-xs border-l-2 border-[#0F766E] pl-3 py-0.5">
                        <p className="font-semibold text-slate-900">{step.phase}</p>
                        <p className="text-slate-700">{step.milestone}</p>
                        <p className="text-slate-500">Target Outcome: {step.outcome}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Parent Guidance & Ethical Disclaimer */}
            <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">Parent & Family Guidance Note</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeProfile.parentGuidanceNote}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">Counsellor Validation & Advisory Note</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeProfile.disclaimer}
                </p>
              </div>
            </div>
          </div>

          {/* PHASE 4 & 5: DIGITAL CAREER REPORT PRODUCTS (FREE, ₹499, ₹999, ₹1,999, ₹2,999) */}
          <div>
            <div className="mb-6">
              <p className="text-xs font-medium text-[#0F766E] mb-1">
                Phase 4 & 5 · Structured Digital Career Reports & Instant Unlock
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Upgrade Your Career Report Depth
              </h3>
              <p className="text-sm text-slate-600">
                All reports include GST invoice, dashboard version history, and PDF download. Use coupon <span className="font-mono font-semibold text-slate-900">FUTURE20</span> at checkout for 20% off.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {reportProducts.map((rep) => {
                const isUnlocked =
                  rep.priceInr === 0 || currentUser.unlockedReportIds.includes(rep.id);
                return (
                  <div
                    key={rep.id}
                    className={`rounded-xl border p-5 flex flex-col justify-between bg-white ${
                      rep.id === 'rep-1999'
                        ? 'border-[#0F766E] ring-1 ring-[#0F766E]'
                        : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span>{rep.pageCount} Pages</span>
                        <span aria-hidden="true">·</span>
                        <span>{rep.includesCounsellorReview ? 'Counsellor Reviewed' : 'Digital Report'}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900">{rep.name}</h4>
                      <div className="mt-2 mb-3">
                        <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                          {rep.tierLabel}
                        </span>
                        {rep.priceInr > 0 && (
                          <span className="text-xs text-slate-500 ml-1">incl. GST</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mb-4">{rep.tagline}</p>

                      <div className="border-t border-slate-100 pt-3 mb-5">
                        <p className="text-xs font-semibold text-slate-800 mb-2">Modules Included:</p>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {rep.modulesIncluded.map((mod, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-[#0F766E] shrink-0 mt-0.5" />
                              <span>{mod}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {isUnlocked ? (
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="w-full py-2.5 px-3 rounded-lg bg-slate-100 text-slate-900 text-xs font-semibold hover:bg-slate-200 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <Download className="w-3.5 h-3.5 text-[#0F766E]" />
                        <span>Unlocked · Download PDF</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onPurchaseReport(rep)}
                        className="w-full py-2.5 px-3 rounded-lg bg-[#0D3B49] text-white text-xs font-semibold hover:bg-slate-800 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Unlock for {rep.tierLabel}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
