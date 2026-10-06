import React, { useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  Bookmark,
  Building2,
  Calculator,
  CheckCircle2,
  GraduationCap,
  Search,
} from 'lucide-react';
import { CareerRecord, CollegeRecord, UserAccount } from '../types/platform';

interface CareersAndCollegesViewProps {
  initialSubTab?: 'careers' | 'compare' | 'colleges';
  careers: CareerRecord[];
  colleges: CollegeRecord[];
  currentUser: UserAccount;
  onToggleSaveCareer: (careerId: string) => void;
  onBookAdmissionGuidance: () => void;
}

export const CareersAndCollegesView: React.FC<CareersAndCollegesViewProps> = ({
  initialSubTab = 'careers',
  careers,
  colleges,
  currentUser,
  onToggleSaveCareer,
  onBookAdmissionGuidance,
}) => {
  const [subTab, setSubTab] = useState<'careers' | 'compare' | 'colleges'>(initialSubTab);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedCareer, setSelectedCareer] = useState<CareerRecord>(careers[0]);

  // Career A vs Career B state
  const [careerAId, setCareerAId] = useState<string>(careers[0]?.id || 'car-ai-eng');
  const [careerBId, setCareerBId] = useState<string>(careers[1]?.id || 'car-prod-mgmt');

  // College & Parent ROI Calculator state
  const [collegeStreamFilter, setCollegeStreamFilter] = useState<string>('ALL');
  const [currentDegreeCostLakhs, setCurrentDegreeCostLakhs] = useState<number>(16);
  const [yearsToCollege, setYearsToCollege] = useState<number>(3);
  const [educationInflationPct, setEducationInflationPct] = useState<number>(8);
  const [expectedStartingCtcLakhs, setExpectedStartingCtcLakhs] = useState<number>(18);

  const categories = useMemo(() => {
    const set = new Set<string>(['ALL']);
    careers.forEach((c) => set.add(c.category));
    return Array.from(set);
  }, [careers]);

  const filteredCareers = useMemo(() => {
    return careers.filter((c) => {
      const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQ =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.coreSkills.some((s) => s.toLowerCase().includes(q)) ||
        c.entranceExams.some((e) => e.toLowerCase().includes(q));
      return matchesCat && matchesQ;
    });
  }, [careers, selectedCategory, searchQuery]);

  const careerA = careers.find((c) => c.id === careerAId) || careers[0];
  const careerB = careers.find((c) => c.id === careerBId) || careers[1] || careers[0];

  const filteredColleges = useMemo(() => {
    if (collegeStreamFilter === 'ALL') return colleges;
    return colleges.filter((col) => col.streamCluster.includes(collegeStreamFilter));
  }, [colleges, collegeStreamFilter]);

  // ROI Calculations
  const futureCorpusLakhs = useMemo(() => {
    const val = currentDegreeCostLakhs * Math.pow(1 + educationInflationPct / 100, yearsToCollege);
    return Number(val.toFixed(1));
  }, [currentDegreeCostLakhs, educationInflationPct, yearsToCollege]);

  const monthlySipNeededInr = useMemo(() => {
    const months = Math.max(12, yearsToCollege * 12);
    const monthlyRate = 0.11 / 12; // 11% assumed balanced education fund return
    const targetInr = futureCorpusLakhs * 100000;
    const sip = (targetInr * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(sip);
  }, [futureCorpusLakhs, yearsToCollege]);

  const paybackYears = useMemo(() => {
    const netAnnualSavings = Math.max(1, expectedStartingCtcLakhs * 0.45);
    return Number((futureCorpusLakhs / netAnnualSavings).toFixed(1));
  }, [futureCorpusLakhs, expectedStartingCtcLakhs]);

  return (
    <div className="py-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-[#0F766E] mb-1">
            Phase 10 & 11 · Central Career Intelligence Database & College Guidance
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Career Library, Side-by-Side Comparison & College ROI
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Explore eligibility, entrance exams, AI automation resilience, entrepreneurship potential, and college cut-offs.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
          <button
            type="button"
            onClick={() => setSubTab('careers')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              subTab === 'careers'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Career Intelligence Library
          </button>
          <button
            type="button"
            onClick={() => setSubTab('compare')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              subTab === 'compare'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Compare (Career A vs B)
          </button>
          <button
            type="button"
            onClick={() => setSubTab('colleges')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              subTab === 'colleges'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Colleges & Parent ROI Calculator
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: CAREER INTELLIGENCE DATABASE */}
      {subTab === 'careers' && (
        <div className="mt-8 space-y-6">
          {/* Search & Category Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                aria-label="Search careers by title, skill, or exam"
                placeholder="Search careers, skills, or entrance exams (e.g. JEE, AI, CLAT, CFA)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#0D3B49] text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Career List Column */}
            <div className="lg:col-span-5 space-y-3">
              {filteredCareers.map((career) => {
                const isSelected = selectedCareer.id === career.id;
                const isSaved = currentUser.savedCareerIds.includes(career.id);
                return (
                  <div
                    key={career.id}
                    onClick={() => setSelectedCareer(career)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setSelectedCareer(career);
                    }}
                    className={`p-5 rounded-xl border transition-all cursor-pointer bg-white ${
                      isSelected
                        ? 'border-[#0F766E] ring-1 ring-[#0F766E]'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
                      <span>{career.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums text-slate-700">
                        Entry: {career.entrySalaryInr}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-bold text-slate-900">{career.name}</h3>
                      <button
                        type="button"
                        aria-label={`Save ${career.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSaveCareer(career.id);
                        }}
                        className={`p-1.5 rounded-md border transition-colors cursor-pointer shrink-0 ${
                          isSaved
                            ? 'bg-[#F0FDFA] border-[#0F766E] text-[#0F766E]'
                            : 'border-slate-200 text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                      {career.description}
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500">
                      Exams: {career.entranceExams.slice(0, 3).join(' · ')}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Career Deep Intelligence Dossier */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span>{selectedCareer.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>Duration: {selectedCareer.studyDurationYears}</span>
                    <span aria-hidden="true">·</span>
                    <span>Competition: {selectedCareer.competitionLevel}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedCareer.name}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCareerAId(selectedCareer.id);
                    setSubTab('compare');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer whitespace-nowrap self-start"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>Compare with Another Career</span>
                </button>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed mt-5">
                {selectedCareer.description}
              </p>

              {/* Compensation Progression Grid (Tabular Numerals) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 p-4 rounded-lg bg-[#F8FAFC] border border-slate-200">
                <div>
                  <span className="block text-xs text-slate-500">Entry-Level Band (0–2 Yrs)</span>
                  <span className="text-base font-bold font-mono tabular-nums text-slate-900">
                    {selectedCareer.entrySalaryInr}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Mid-Career Band (4–8 Yrs)</span>
                  <span className="text-base font-bold font-mono tabular-nums text-[#0F766E]">
                    {selectedCareer.midCareerSalaryInr}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Senior / Principal (10+ Yrs)</span>
                  <span className="text-base font-bold font-mono tabular-nums text-slate-900">
                    {selectedCareer.seniorSalaryInr}
                  </span>
                </div>
              </div>

              {/* Structured Career Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1.5">Eligibility & Required Subjects</h4>
                  <p className="text-slate-600 mb-2">{selectedCareer.eligibility}</p>
                  <p className="text-slate-700">
                    <span className="font-semibold">Subjects: </span>
                    {selectedCareer.requiredSubjects.join(' · ')}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-1.5">Key Entrance Exams</h4>
                  <p className="text-slate-700 leading-relaxed">
                    {selectedCareer.entranceExams.join(' · ')}
                  </p>
                  <h4 className="font-bold text-slate-900 mt-3 mb-1">Top Colleges</h4>
                  <p className="text-slate-600">{selectedCareer.topColleges.join(' · ')}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-1.5">Core Skills & Certifications</h4>
                  <p className="text-slate-700 mb-2">{selectedCareer.coreSkills.join(' · ')}</p>
                  <p className="text-slate-500">
                    Certifications: {selectedCareer.certifications.join(' · ')}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-1.5">AI & Automation Considerations</h4>
                  <p className="font-semibold text-[#0F766E] mb-1">
                    Risk Profile: {selectedCareer.automationRisk}
                  </p>
                  <p className="text-slate-600 leading-relaxed">{selectedCareer.aiImpact}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Entrepreneurship Opportunities</h4>
                  <p className="text-slate-600 leading-relaxed">
                    {selectedCareer.entrepreneurshipOpportunities}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Freelancing & Global Remote Scope</h4>
                  <p className="text-slate-600 leading-relaxed">
                    {selectedCareer.freelancingOpportunities}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CAREER A VS CAREER B COMPARISON MATRIX */}
      {subTab === 'compare' && (
        <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 mb-6 border-b border-slate-200">
            <div>
              <label htmlFor="select-career-a" className="block text-xs font-bold text-slate-700 mb-2">
                Select Career Pathway A
              </label>
              <select
                id="select-career-a"
                value={careerAId}
                onChange={(e) => setCareerAId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-semibold bg-[#F8FAFC] border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              >
                {careers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.category})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="select-career-b" className="block text-xs font-bold text-slate-700 mb-2">
                Select Career Pathway B
              </label>
              <select
                id="select-career-b"
                value={careerBId}
                onChange={(e) => setCareerBId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-semibold bg-[#F8FAFC] border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              >
                {careers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500">
                  <th className="py-3 pr-4 font-semibold w-1/4">Comparison Parameter</th>
                  <th className="py-3 px-4 font-bold text-slate-900 text-sm w-[37.5%] bg-[#F8FAFC]">
                    {careerA.name}
                  </th>
                  <th className="py-3 pl-4 font-bold text-slate-900 text-sm w-[37.5%]">
                    {careerB.name}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-slate-700">Eligibility & Stream</td>
                  <td className="py-3.5 px-4 text-slate-700 bg-[#F8FAFC]">{careerA.eligibility}</td>
                  <td className="py-3.5 pl-4 text-slate-700">{careerB.eligibility}</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-slate-700">Study Duration</td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-800 bg-[#F8FAFC]">
                    {careerA.studyDurationYears}
                  </td>
                  <td className="py-3.5 pl-4 font-mono tabular-nums text-slate-800">
                    {careerB.studyDurationYears}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-slate-700">Estimated Education Cost</td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-800 bg-[#F8FAFC]">
                    {careerA.avgEducationCostInr}
                  </td>
                  <td className="py-3.5 pl-4 font-mono tabular-nums text-slate-800">
                    {careerB.avgEducationCostInr}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-slate-700">Key Entrance Exams</td>
                  <td className="py-3.5 px-4 text-slate-700 bg-[#F8FAFC]">
                    {careerA.entranceExams.join(' · ')}
                  </td>
                  <td className="py-3.5 pl-4 text-slate-700">
                    {careerB.entranceExams.join(' · ')}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-slate-700">Core Skills Required</td>
                  <td className="py-3.5 px-4 text-slate-700 bg-[#F8FAFC]">
                    {careerA.coreSkills.join(' · ')}
                  </td>
                  <td className="py-3.5 pl-4 text-slate-700">
                    {careerB.coreSkills.join(' · ')}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-slate-700">Competition Intensity</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 bg-[#F8FAFC]">
                    {careerA.competitionLevel}
                  </td>
                  <td className="py-3.5 pl-4 font-semibold text-slate-900">
                    {careerB.competitionLevel}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-slate-700">Compensation Progression</td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-900 bg-[#F8FAFC]">
                    Entry: {careerA.entrySalaryInr} → Mid: {careerA.midCareerSalaryInr}
                  </td>
                  <td className="py-3.5 pl-4 font-mono tabular-nums text-slate-900">
                    Entry: {careerB.entrySalaryInr} → Mid: {careerB.midCareerSalaryInr}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-slate-700">AI & Automation Impact</td>
                  <td className="py-3.5 px-4 text-slate-700 bg-[#F8FAFC]">
                    <span className="font-semibold text-[#0F766E] block mb-0.5">
                      {careerA.automationRisk}
                    </span>
                    {careerA.aiImpact}
                  </td>
                  <td className="py-3.5 pl-4 text-slate-700">
                    <span className="font-semibold text-[#0F766E] block mb-0.5">
                      {careerB.automationRisk}
                    </span>
                    {careerB.aiImpact}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-slate-700">Entrepreneurship & Business</td>
                  <td className="py-3.5 px-4 text-slate-700 bg-[#F8FAFC]">
                    {careerA.entrepreneurshipOpportunities}
                  </td>
                  <td className="py-3.5 pl-4 text-slate-700">
                    {careerB.entrepreneurshipOpportunities}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: COLLEGE GUIDANCE & PARENT EDUCATION FINANCE / ROI CALCULATOR */}
      {subTab === 'colleges' && (
        <div className="mt-8 space-y-10">
          {/* Parent Education Finance & ROI Calculator */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <p className="text-xs font-medium text-[#B45309] mb-1">
                  Parent Services · Career Finance & Education ROI Planner
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Higher-Education Corpus & Degree Payback Calculator
                </h2>
              </div>
              <button
                type="button"
                onClick={onBookAdmissionGuidance}
                className="px-4 py-2.5 rounded-lg bg-[#0D3B49] text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap self-start"
              >
                Book Parent & Admission Counselling
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-center">
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="roi-cost" className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Total Degree Cost (₹ Lakhs)
                  </label>
                  <input
                    id="roi-cost"
                    type="number"
                    min={1}
                    max={150}
                    value={currentDegreeCostLakhs}
                    onChange={(e) => setCurrentDegreeCostLakhs(Number(e.target.value) || 1)}
                    className="w-full px-3.5 py-2 text-sm font-mono tabular-nums bg-[#F8FAFC] border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="roi-years" className="block text-xs font-semibold text-slate-700 mb-1">
                    Years Remaining Until College Entry
                  </label>
                  <input
                    id="roi-years"
                    type="number"
                    min={0}
                    max={15}
                    value={yearsToCollege}
                    onChange={(e) => setYearsToCollege(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 text-sm font-mono tabular-nums bg-[#F8FAFC] border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="roi-inflation" className="block text-xs font-semibold text-slate-700 mb-1">
                    Education Inflation Rate (% p.a.)
                  </label>
                  <input
                    id="roi-inflation"
                    type="number"
                    min={4}
                    max={15}
                    value={educationInflationPct}
                    onChange={(e) => setEducationInflationPct(Number(e.target.value) || 6)}
                    className="w-full px-3.5 py-2 text-sm font-mono tabular-nums bg-[#F8FAFC] border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="roi-ctc" className="block text-xs font-semibold text-slate-700 mb-1">
                    Projected Starting Package (₹ LPA)
                  </label>
                  <input
                    id="roi-ctc"
                    type="number"
                    min={3}
                    max={80}
                    value={expectedStartingCtcLakhs}
                    onChange={(e) => setExpectedStartingCtcLakhs(Number(e.target.value) || 5)}
                    className="w-full px-3.5 py-2 text-sm font-mono tabular-nums bg-[#F8FAFC] border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#F8FAFC] rounded-xl border border-slate-200 p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0F766E]">
                  <Calculator className="w-4 h-4" />
                  <span>Calculated Family Financial Projections</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                  <div>
                    <span className="block text-xs text-slate-500">Inflation-Adjusted Corpus</span>
                    <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                      ₹{futureCorpusLakhs} Lakhs
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500">Est. Degree Payback Period</span>
                    <span className="text-xl font-bold font-mono tabular-nums text-[#0F766E]">
                      {paybackYears} Years
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <span className="block text-xs text-slate-500">
                    Recommended Monthly Education Provisioning
                  </span>
                  <span className="text-lg font-bold font-mono tabular-nums text-slate-900">
                    ₹{monthlySipNeededInr.toLocaleString('en-IN')} / month
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* College Directory & Matching */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Verified Indian Institution & Cut-Off Directory
                </h3>
                <p className="text-xs text-slate-600">
                  Compare admission processes, entrance exams, total fees, and median placement outcomes.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['ALL', 'Technology', 'Finance', 'Design'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setCollegeStreamFilter(st)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      collegeStreamFilter === st
                        ? 'bg-[#0D3B49] text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {st === 'ALL' ? 'All Streams' : st}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredColleges.map((col) => (
                <div
                  key={col.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#0F766E]" />
                      <span>{col.location}, {col.state}</span>
                      <span aria-hidden="true">·</span>
                      <span>{col.duration}</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{col.name}</h4>
                    <p className="text-xs text-slate-700 mb-3">
                      <span className="font-semibold">Flagship Programs: </span>
                      {col.coursesOffered.join(' · ')}
                    </p>

                    <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-[#F8FAFC] border border-slate-100 mb-4">
                      <div>
                        <span className="block text-xs text-slate-500">Annual Tuition Fee</span>
                        <span className="text-sm font-bold font-mono tabular-nums text-slate-900">
                          {col.annualFeesInr}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs text-slate-500">Median Placement</span>
                        <span className="text-sm font-bold font-mono tabular-nums text-[#0F766E]">
                          {col.avgPlacementPackageInr}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <p>
                        <strong className="text-slate-800">Entrance Exams:</strong>{' '}
                        {col.entranceExams.join(' · ')}
                      </p>
                      <p>
                        <strong className="text-slate-800">Cut-off Benchmark:</strong>{' '}
                        {col.cutoffInfo}
                      </p>
                      <p>
                        <strong className="text-slate-800">Career Outcomes:</strong>{' '}
                        {col.careerOutcomes}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" />
                      Hostel & Placement Cell Active
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentDegreeCostLakhs(Math.round(col.totalProgramCostNumeric / 100000));
                        setExpectedStartingCtcLakhs(Math.round(col.avgPlacementNumeric / 100000));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs font-semibold text-[#0F766E] hover:underline cursor-pointer"
                    >
                      Load into ROI Calculator →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
