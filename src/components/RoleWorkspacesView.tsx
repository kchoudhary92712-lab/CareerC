import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  Layers,
  PlusCircle,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react';
import { RBAC_PERMISSION_MATRIX } from '../data/seedData';
import {
  CrmStage,
  PlatformDatabase,
  UserRole,
} from '../types/platform';

const CRM_STAGES: CrmStage[] = [
  'New Lead',
  'Contacted',
  'Interested',
  'Assessment Started',
  'Assessment Completed',
  'Report Purchased',
  'Counselling Booked',
  'Counselling Completed',
  'Course Interested',
  'Course Admission',
  'Converted',
  'Lost',
];

const LIFECYCLE_STAGES = [
  '5th',
  '6th',
  '7th',
  '8th',
  '9th',
  '10th',
  '11th',
  '12th',
  'UG',
  'Career',
];

interface RoleWorkspacesViewProps {
  initialRole?: UserRole;
  db: PlatformDatabase;
  onUpdateLeadStage: (leadId: string, stage: CrmStage) => Promise<void>;
  onUpdateCounsellorFee: (counsellorId: string, feeInr: number) => Promise<void>;
  onAddCareerCms: (payload: {
    name: string;
    category: string;
    description: string;
    eligibility: string;
    entrySalaryInr: string;
  }) => Promise<void>;
  onRequestSchoolProgram: (schoolName: string, city: string, mobile: string, email: string) => Promise<void>;
}

export const RoleWorkspacesView: React.FC<RoleWorkspacesViewProps> = ({
  initialRole = 'Student',
  db,
  onUpdateLeadStage,
  onUpdateCounsellorFee,
  onAddCareerCms,
  onRequestSchoolProgram,
}) => {
  const [activeRole, setActiveRole] = useState<UserRole>(initialRole);

  // Counsellor availability form state
  const firstCounsellor = db.counsellors[0];
  const [editFee, setEditFee] = useState<number>(firstCounsellor?.feeInr || 1499);
  const [feeSavedMsg, setFeeSavedMsg] = useState<string>('');

  // School B2B lead form state
  const [schoolName, setSchoolName] = useState<string>('');
  const [schoolCity, setSchoolCity] = useState<string>('');
  const [schoolMobile, setSchoolMobile] = useState<string>('');
  const [schoolEmail, setSchoolEmail] = useState<string>('');
  const [schoolSubmitted, setSchoolSubmitted] = useState<boolean>(false);

  // Admin CMS add career form state
  const [cmsCareerName, setCmsCareerName] = useState<string>('');
  const [cmsCategory, setCmsCategory] = useState<string>('Emerging Careers');
  const [cmsDesc, setCmsDesc] = useState<string>('');
  const [cmsEligibility, setCmsEligibility] = useState<string>('Class 12 Any Stream · CUET / Portfolio');
  const [cmsSalary, setCmsSalary] = useState<string>('₹8.0L – ₹16.0L PA');
  const [cmsAddedMsg, setCmsAddedMsg] = useState<string>('');

  const totalRevenueInr = db.orders.reduce((acc, o) => acc + o.totalPaidInr, 0);
  const totalSchoolAcvInr = db.institutions.reduce((acc, i) => acc + i.annualContractValueInr, 0);

  const handleSaveCounsellorFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstCounsellor) return;
    await onUpdateCounsellorFee(firstCounsellor.id, editFee);
    setFeeSavedMsg('Updated fee & availability synced to marketplace.');
    setTimeout(() => setFeeSavedMsg(''), 3000);
  };

  const handleSchoolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName || !schoolMobile || !schoolEmail) return;
    await onRequestSchoolProgram(schoolName, schoolCity || 'Pune', schoolMobile, schoolEmail);
    setSchoolSubmitted(true);
    setSchoolName('');
    setSchoolCity('');
    setSchoolMobile('');
    setSchoolEmail('');
  };

  const handleCmsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmsCareerName || !cmsDesc) return;
    await onAddCareerCms({
      name: cmsCareerName,
      category: cmsCategory,
      description: cmsDesc,
      eligibility: cmsEligibility,
      entrySalaryInr: cmsSalary,
    });
    setCmsCareerName('');
    setCmsDesc('');
    setCmsAddedMsg('New career published to Central Career Database.');
    setTimeout(() => setCmsAddedMsg(''), 3500);
  };

  const roleTabs: UserRole[] = [
    'Student',
    'Parent',
    'Counsellor',
    'Institution Admin',
    'Sales/CRM User',
    'Super Admin',
  ];

  const currentRbac = RBAC_PERMISSION_MATRIX[activeRole] || RBAC_PERMISSION_MATRIX.Student;

  return (
    <div className="py-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Role Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-8 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-[#0F766E] mb-1">
            Phase 0, 7, 9, 14, 15, 17–19 · Multi-Role RBAC Workspaces, B2B Portal, CRM & Admin Console
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Unified Role-Based Workspaces & Operations Console
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Switch between Student, Parent, Counsellor, School B2B Principal, CRM Sales, and Super Admin views.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 rounded-xl self-start">
          {roleTabs.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setActiveRole(r)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeRole === r
                  ? 'bg-[#0D3B49] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* RBAC Context Bar */}
      <div className="mt-6 mb-8 p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-bold text-slate-900">Active Role Permission Scope ({activeRole}): </span>
          <span className="text-slate-600">{currentRbac.description}</span>
        </div>
        <div className="text-slate-500 shrink-0">
          Modules: <span className="font-medium text-slate-800">{currentRbac.modules.join(' · ')}</span>
        </div>
      </div>

      {/* 1. STUDENT DASHBOARD (PHASE 9) */}
      {activeRole === 'Student' && (
        <div className="space-y-8">
          {/* Student Lifecycle Progression Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Student Longitudinal Career Lifecycle (Class 5 → Career)
                </h2>
                <p className="text-xs text-slate-500">
                  Active Student: Aarav Kulkarni · Current Stage: 11th–12th (PCM + Computer Science)
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-[#0F766E]">
                Readiness Score: 86/100
              </span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {LIFECYCLE_STAGES.map((st, idx) => {
                const isCompleted = idx <= 6; // up to 11th
                const isCurrent = st === '11th' || st === '12th';
                return (
                  <div
                    key={st}
                    className={`py-2.5 px-2 rounded-lg text-center border text-xs font-mono font-semibold ${
                      isCurrent
                        ? 'bg-[#0F766E] text-white border-[#0F766E]'
                        : isCompleted
                        ? 'bg-[#F0FDFA] text-[#0F766E] border-teal-200'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    {st}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Unlocked Reports */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                Unlocked Career Reports ({db.users[0]?.unlockedReportIds.length || 2})
              </h3>
              <div className="space-y-3 text-xs">
                {db.reportProducts
                  .filter((r) => db.users[0]?.unlockedReportIds.includes(r.id))
                  .map((rep) => (
                    <div key={rep.id} className="p-3.5 rounded-lg bg-[#F8FAFC] border border-slate-200">
                      <p className="font-bold text-slate-900">{rep.name}</p>
                      <p className="text-slate-500 mt-0.5">
                        {rep.pageCount} Pages · Version 1.2 · Ready for PDF Print
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Upcoming Counselling Appointments */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                Counselling & Mentorship Sessions
              </h3>
              <div className="space-y-3 text-xs">
                {db.bookings.map((bk) => (
                  <div key={bk.id} className="p-3.5 rounded-lg bg-[#F8FAFC] border border-slate-200">
                    <p className="font-bold text-slate-900">{bk.serviceTitle}</p>
                    <p className="text-slate-600 mt-0.5">
                      Counsellor: {bk.counsellorName}
                    </p>
                    <p className="font-mono text-[#0F766E] mt-1">
                      {bk.date} at {bk.slot} · {bk.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications & Reminders */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                Recent Notifications & Invoices
              </h3>
              <div className="space-y-3 text-xs">
                {db.notifications.slice(0, 3).map((n) => (
                  <div key={n.id} className="pb-2.5 border-b border-slate-100 last:border-b-0">
                    <p className="font-semibold text-slate-900">
                      [{n.channel}] {n.title}
                    </p>
                    <p className="text-slate-600 mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PARENT DASHBOARD (PHASE 9) */}
      {activeRole === 'Parent' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <div className="pb-4 border-b border-slate-200">
              <p className="text-xs text-[#B45309] font-semibold">
                Parent Account · Vikram Kulkarni (Pune)
              </p>
              <h2 className="text-xl font-bold text-slate-900">
                Child Progress & Counsellor Feedback Summary
              </h2>
            </div>

            <div className="p-4 rounded-lg bg-[#F8FAFC] border border-slate-200 text-xs space-y-2">
              <p className="font-bold text-slate-900 text-sm">
                Child Profile: Aarav Kulkarni (Class 11 CBSE · Symbiosis Junior College)
              </p>
              <p className="text-slate-700">
                <strong>Suggested High-Fit Cluster:</strong> Technology, AI & Data Engineering (Readiness: 86/100)
              </p>
              <p className="text-slate-700">
                <strong>Counsellor Validation (Dr. Meera Sharma):</strong>{' '}
                {db.profiles[0]?.counsellorReviewNote}
              </p>
              <p className="text-slate-600">
                <strong>Parent Guidance Note:</strong> {db.profiles[0]?.parentGuidanceNote}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                Payment & GST Invoice Ledger
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 pr-3">Invoice #</th>
                      <th className="py-2 px-3">Product / Service</th>
                      <th className="py-2 px-3">Method</th>
                      <th className="py-2 pl-3 text-right">Total Paid (incl. GST)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {db.orders.map((ord) => (
                      <tr key={ord.id}>
                        <td className="py-2.5 pr-3 font-mono text-slate-700">{ord.invoiceNumber}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-900">{ord.productName}</td>
                        <td className="py-2.5 px-3 text-slate-600">{ord.paymentMethod}</td>
                        <td className="py-2.5 pl-3 font-mono tabular-nums text-right font-semibold text-slate-900">
                          ₹{ord.totalPaidInr}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Recommended Skill Courses for Child
            </h3>
            <p className="text-xs text-slate-600">
              Mapped directly from Aarav’s development area in Executive Public Speaking (74%) and interest in Applied AI (94%):
            </p>
            {db.courses.slice(0, 2).map((crs) => (
              <div key={crs.id} className="p-4 rounded-lg border border-slate-200 text-xs">
                <p className="font-bold text-slate-900">{crs.title}</p>
                <p className="text-slate-600 my-1">{crs.schedule}</p>
                <p className="font-mono font-semibold text-[#0F766E]">Fee: ₹{crs.feesInr}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. COUNSELLOR DASHBOARD (PHASE 7) */}
      {activeRole === 'Counsellor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Counsellor Session Queue & Student Notes ({db.bookings.length} Active)
            </h2>
            <div className="space-y-4">
              {db.bookings.map((bk) => (
                <div key={bk.id} className="p-4 rounded-lg border border-slate-200 bg-[#F8FAFC] text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-sm">
                      {bk.studentName} ({bk.studentCohort})
                    </span>
                    <span className="font-mono font-semibold text-[#0F766E]">
                      {bk.date} · {bk.slot}
                    </span>
                  </div>
                  <p className="text-slate-700 font-medium">{bk.serviceTitle}</p>
                  <p className="text-slate-600 mt-1">Pre-Session Notes: {bk.notes}</p>
                  <p className="font-mono text-slate-500 mt-1.5">Room: {bk.meetingLink}</p>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSaveCounsellorFee}
            className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-4 self-start"
          >
            <h3 className="text-base font-bold text-slate-900">
              Availability & Fee Configuration ({firstCounsellor?.name})
            </h3>
            <div>
              <label htmlFor="cns-fee-input" className="block text-xs font-semibold text-slate-700 mb-1">
                45-Min Session Fee (INR)
              </label>
              <input
                id="cns-fee-input"
                type="number"
                value={editFee}
                onChange={(e) => setEditFee(Number(e.target.value) || 999)}
                className="w-full px-3.5 py-2 text-sm font-mono bg-[#F8FAFC] border border-slate-300 rounded-lg"
              />
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <p>
                <strong>Active Days:</strong> {firstCounsellor?.availableDays.join(' · ')}
              </p>
              <p>
                <strong>Active Slots:</strong> {firstCounsellor?.availableSlots.join(' / ')}
              </p>
              <p>
                <strong>Buffer Between Bookings:</strong> {firstCounsellor?.bufferMins} Mins
              </p>
            </div>
            {feeSavedMsg && (
              <p className="text-xs font-semibold text-[#0F766E]">{feeSavedMsg}</p>
            )}
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-[#0D3B49] text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer"
            >
              Update Fee & Sync Marketplace
            </button>
          </form>
        </div>
      )}

      {/* 4. SCHOOL & COLLEGE B2B PLATFORM (PHASE 14) */}
      {activeRole === 'Institution Admin' && (
        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-xs font-semibold text-[#0F766E] mb-1">
              Phase 14 · Institutional B2B Revenue & NEP 2020 Career Guidance Cell
            </p>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              School & College Career Dashboard
            </h2>
            <p className="text-xs text-slate-600 mb-6">
              Institutional Workflow: School Lead → Principal Meeting → Free Seminar → Assessment Drive → Student Leads → Counselling → Skill Workshops → Annual Tie-up
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-3 pr-4">Institution Name</th>
                    <th className="py-3 px-4">Principal / Dean</th>
                    <th className="py-3 px-4 text-right">Students Enrolled</th>
                    <th className="py-3 px-4 text-right">Assessments Done</th>
                    <th className="py-3 px-4">Active B2B Program</th>
                    <th className="py-3 px-4">Workflow Stage</th>
                    <th className="py-3 pl-4 text-right">Annual Contract (ACV)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {db.institutions.map((inst) => (
                    <tr key={inst.id} className="hover:bg-slate-50">
                      <td className="py-3.5 pr-4 font-bold text-slate-900">
                        {inst.institutionName} ({inst.city})
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">{inst.principalOrDean}</td>
                      <td className="py-3.5 px-4 font-mono tabular-nums text-right text-slate-800">
                        {inst.studentsEnrolled}
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums text-right text-[#0F766E] font-semibold">
                        {inst.assessmentsCompleted}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{inst.activeProgram}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {inst.workflowStage}
                      </td>
                      <td className="py-3.5 pl-4 font-mono tabular-nums text-right font-bold text-slate-900">
                        ₹{inst.annualContractValueInr.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Partner School / College Onboarding Form */}
          <form
            onSubmit={handleSchoolSubmit}
            className="bg-white rounded-xl border border-slate-200 p-6 max-w-2xl space-y-4"
          >
            <h3 className="text-base font-bold text-slate-900">
              Schedule a Principal Meeting / Free Campus Career Seminar
            </h3>
            {schoolSubmitted && (
              <p className="text-xs font-semibold text-[#0F766E]">
                Institutional request logged in CRM with Priority Score 95/100.
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="b2b-school-name" className="block text-xs font-semibold text-slate-700 mb-1">
                  School / College Name
                </label>
                <input
                  id="b2b-school-name"
                  type="text"
                  required
                  placeholder="e.g. Podar International School"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="b2b-city" className="block text-xs font-semibold text-slate-700 mb-1">
                  City
                </label>
                <input
                  id="b2b-city"
                  type="text"
                  required
                  placeholder="e.g. Mumbai"
                  value={schoolCity}
                  onChange={(e) => setSchoolCity(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="b2b-mobile" className="block text-xs font-semibold text-slate-700 mb-1">
                  Coordinator / Principal Mobile
                </label>
                <input
                  id="b2b-mobile"
                  type="tel"
                  required
                  placeholder="+91 98200 00000"
                  value={schoolMobile}
                  onChange={(e) => setSchoolMobile(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="b2b-email" className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email
                </label>
                <input
                  id="b2b-email"
                  type="email"
                  required
                  placeholder="principal@school.edu.in"
                  value={schoolEmail}
                  onChange={(e) => setSchoolEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#0F766E] text-white text-xs font-semibold hover:bg-[#115E59] cursor-pointer"
            >
              Request Institutional Partnership Proposal
            </button>
          </form>
        </div>
      )}

      {/* 5. CRM & SALES AUTOMATION PIPELINE (PHASE 15) */}
      {activeRole === 'Sales/CRM User' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <p className="text-xs font-semibold text-[#0F766E]">
                Phase 15 · End-to-End Lead Capture, Scoring & Sales Pipeline Automation
              </p>
              <h2 className="text-xl font-bold text-slate-900">
                Active Leads & Conversion Pipeline ({db.leads.length})
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              Auto-Triggers: WhatsApp Assessment Link · 24h Report Follow-up · Counselling Reminder
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3 pr-3">Lead Name & City</th>
                  <th className="py-3 px-3">User Type / Cohort</th>
                  <th className="py-3 px-3">Service Interested</th>
                  <th className="py-3 px-3">Channel & Source</th>
                  <th className="py-3 px-3 text-right">Lead Score</th>
                  <th className="py-3 pl-3">Pipeline Stage (Interactive)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {db.leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50">
                    <td className="py-3.5 pr-3">
                      <p className="font-bold text-slate-900">{lead.name}</p>
                      <p className="text-slate-500 font-mono">
                        {lead.mobile} · {lead.city}
                      </p>
                    </td>
                    <td className="py-3.5 px-3 text-slate-700">
                      {lead.userType} · {lead.studentClassOrRole}
                    </td>
                    <td className="py-3.5 px-3 text-slate-700">
                      <p className="font-medium text-slate-900">{lead.serviceInterested}</p>
                      <p className="text-slate-500 line-clamp-1">{lead.notes}</p>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">
                      {lead.preferredContact} · {lead.leadSource}
                    </td>
                    <td className="py-3.5 px-3 font-mono tabular-nums text-right font-bold text-[#0F766E]">
                      {lead.leadScore}/100
                    </td>
                    <td className="py-3.5 pl-3">
                      <select
                        aria-label={`Stage for ${lead.name}`}
                        value={lead.stage}
                        onChange={(e) =>
                          onUpdateLeadStage(lead.id, e.target.value as CrmStage)
                        }
                        className="px-2.5 py-1.5 text-xs font-semibold bg-[#F8FAFC] border border-slate-300 rounded-md"
                      >
                        {CRM_STAGES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. SUPER ADMIN CMS, RBAC & BI ANALYTICS CONSOLE (PHASE 0, 17, 18, 19) */}
      {activeRole === 'Super Admin' && (
        <div className="space-y-8">
          {/* BI & Revenue Metrics Row (Tabular Numerals) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <span className="block text-xs text-slate-500">B2C Direct Order Revenue</span>
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1 block">
                ₹{totalRevenueInr.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-[#0F766E] mt-1 block">
                {db.orders.length} Paid GST Invoices
              </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <span className="block text-xs text-slate-500">B2B School Annual Contract Pipeline</span>
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1 block">
                ₹{totalSchoolAcvInr.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-600 mt-1 block">
                {db.institutions.length} Partner Institutions
              </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <span className="block text-xs text-slate-500">Assessment-to-Profile Conversion</span>
              <span className="text-2xl font-bold font-mono tabular-nums text-[#0F766E] mt-1 block">
                78.4%
              </span>
              <span className="text-xs text-slate-600 mt-1 block">
                {db.profiles.length} Detailed Profiles Generated
              </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <span className="block text-xs text-slate-500">Active Catalog Entities (CMS)</span>
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1 block">
                {db.careers.length + db.colleges.length + db.courses.length + db.counsellors.length}
              </span>
              <span className="text-xs text-slate-600 mt-1 block">
                {db.careers.length} Careers · {db.colleges.length} Colleges · {db.courses.length} Courses
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* CMS: Publish New Career to Central Database */}
            <form
              onSubmit={handleCmsSubmit}
              className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-4 self-start"
            >
              <div>
                <p className="text-xs font-semibold text-[#0F766E]">
                  Phase 17 & 18 · Central CMS & Career Database Publisher
                </p>
                <h3 className="text-base font-bold text-slate-900">
                  Publish New Career Profile to Database
                </h3>
              </div>

              {cmsAddedMsg && (
                <p className="text-xs font-semibold text-[#0F766E]">{cmsAddedMsg}</p>
              )}

              <div>
                <label htmlFor="cms-career-title" className="block text-xs font-semibold text-slate-700 mb-1">
                  Career Title
                </label>
                <input
                  id="cms-career-title"
                  type="text"
                  required
                  placeholder="e.g. Climate Tech & Sustainability Analyst"
                  value={cmsCareerName}
                  onChange={(e) => setCmsCareerName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-[#F8FAFC] border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label htmlFor="cms-career-cat" className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  id="cms-career-cat"
                  value={cmsCategory}
                  onChange={(e) => setCmsCategory(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-[#F8FAFC] border border-slate-300 rounded-lg"
                >
                  <option value="Emerging Careers">Emerging Careers</option>
                  <option value="AI & Data">AI & Data</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance & Commerce">Finance & Commerce</option>
                  <option value="Management">Management</option>
                  <option value="Design & Media">Design & Media</option>
                </select>
              </div>

              <div>
                <label htmlFor="cms-career-elig" className="block text-xs font-semibold text-slate-700 mb-1">
                  Eligibility & Stream
                </label>
                <input
                  id="cms-career-elig"
                  type="text"
                  value={cmsEligibility}
                  onChange={(e) => setCmsEligibility(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-[#F8FAFC] border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label htmlFor="cms-career-sal" className="block text-xs font-semibold text-slate-700 mb-1">
                  Entry Salary Band (INR)
                </label>
                <input
                  id="cms-career-sal"
                  type="text"
                  value={cmsSalary}
                  onChange={(e) => setCmsSalary(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-mono bg-[#F8FAFC] border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label htmlFor="cms-career-desc" className="block text-xs font-semibold text-slate-700 mb-1">
                  Description & Future Outlook
                </label>
                <textarea
                  id="cms-career-desc"
                  rows={3}
                  required
                  placeholder="Describe core responsibilities, AI resilience, and industry demand..."
                  value={cmsDesc}
                  onChange={(e) => setCmsDesc(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-[#F8FAFC] border border-slate-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-[#0D3B49] text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer"
              >
                Publish Career to Live Platform
              </button>
            </form>

            {/* Phase 0 RBAC Matrix & SEO Landing Pages Registry */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-base font-bold text-slate-900 mb-3">
                Phase 0 · Configured Role-Based Access Control (RBAC) Matrix (11 Roles)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 pr-3">Role</th>
                      <th className="py-2 px-3">Primary Modules</th>
                      <th className="py-2 px-3 text-center">CMS</th>
                      <th className="py-2 px-3 text-center">CRM</th>
                      <th className="py-2 pl-3 text-center">Finance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {Object.entries(RBAC_PERMISSION_MATRIX).map(([rName, perm]) => (
                      <tr key={rName}>
                        <td className="py-2 pr-3 font-bold text-slate-900">{rName}</td>
                        <td className="py-2 px-3 text-slate-600">
                          {perm.modules.slice(0, 3).join(' · ')}
                        </td>
                        <td className="py-2 px-3 text-center font-mono">
                          {perm.canEditContent ? 'YES' : '—'}
                        </td>
                        <td className="py-2 px-3 text-center font-mono">
                          {perm.canManageCRM ? 'YES' : '—'}
                        </td>
                        <td className="py-2 pl-3 text-center font-mono">
                          {perm.canViewFinancials ? 'YES' : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
