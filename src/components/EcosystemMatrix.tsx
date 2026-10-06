import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Compass,
  FileText,
  Layers,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import { ECOSYSTEM_PILLARS } from '../data/seedData';
import { EcosystemNodeItem, EcosystemPillar } from '../types/platform';

interface EcosystemMatrixProps {
  onNavigateNode: (item: EcosystemNodeItem) => void;
  onBookCounsellingForNode?: (item: EcosystemNodeItem, pillar: EcosystemPillar) => void;
  onRequestCallbackForNode?: (item: EcosystemNodeItem, pillar: EcosystemPillar) => void;
}

export const EcosystemMatrix: React.FC<EcosystemMatrixProps> = ({
  onNavigateNode,
  onBookCounsellingForNode,
  onRequestCallbackForNode,
}) => {
  const [selectedPillar, setSelectedPillar] = useState<EcosystemPillar>(ECOSYSTEM_PILLARS[0]);
  const [selectedItem, setSelectedItem] = useState<EcosystemNodeItem>(ECOSYSTEM_PILLARS[0].items[2]); // Default Class 9-10

  const handleSelectPillar = (pillar: EcosystemPillar) => {
    setSelectedPillar(pillar);
    setSelectedItem(pillar.items[0]);
  };

  const handleSelectNode = (pillar: EcosystemPillar, item: EcosystemNodeItem) => {
    setSelectedPillar(pillar);
    setSelectedItem(item);
  };

  const currentItemIndex = selectedPillar.items.findIndex((i) => i.id === selectedItem.id);

  const handlePrevSubTab = () => {
    if (currentItemIndex > 0) {
      setSelectedItem(selectedPillar.items[currentItemIndex - 1]);
    } else {
      const pillarIdx = ECOSYSTEM_PILLARS.findIndex((p) => p.id === selectedPillar.id);
      const prevPillar =
        ECOSYSTEM_PILLARS[(pillarIdx - 1 + ECOSYSTEM_PILLARS.length) % ECOSYSTEM_PILLARS.length];
      setSelectedPillar(prevPillar);
      setSelectedItem(prevPillar.items[prevPillar.items.length - 1]);
    }
  };

  const handleNextSubTab = () => {
    if (currentItemIndex < selectedPillar.items.length - 1) {
      setSelectedItem(selectedPillar.items[currentItemIndex + 1]);
    } else {
      const pillarIdx = ECOSYSTEM_PILLARS.findIndex((p) => p.id === selectedPillar.id);
      const nextPillar = ECOSYSTEM_PILLARS[(pillarIdx + 1) % ECOSYSTEM_PILLARS.length];
      setSelectedPillar(nextPillar);
      setSelectedItem(nextPillar.items[0]);
    }
  };

  return (
    <section id="ecosystem-architecture" className="py-16 border-b border-slate-200 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-semibold text-[#0F766E] tracking-wide mb-2">
              01. Unified Career360 Ecosystem Architecture · Interactive 6-Pillar & 37-Module Map
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Six Pillars Connecting Every Stage of Career & Skill Readiness
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-md">
            Click any of the <strong className="text-slate-900">6 Pillar Tabs</strong> or any of the{' '}
            <strong className="text-slate-900">37 Stage & Service Tabs</strong> below to inspect its complete roadmap, deliverables, and interactive tools.
          </p>
        </div>

        {/* Top-Level 6-Pillar Quick Switcher Tabs */}
        <div
          role="tablist"
          aria-label="Six Career360 Ecosystem Pillars"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-8 p-2 rounded-xl bg-slate-100 border border-slate-200"
        >
          {ECOSYSTEM_PILLARS.map((pillar) => {
            const isPillarActive = selectedPillar.id === pillar.id;
            return (
              <button
                key={`pillar-tab-${pillar.id}`}
                type="button"
                role="tab"
                aria-selected={isPillarActive}
                onClick={() => handleSelectPillar(pillar)}
                className={`flex flex-col items-start justify-between p-3 rounded-lg text-left transition-all cursor-pointer border ${
                  isPillarActive
                    ? 'bg-[#0D3B49] text-white border-[#0D3B49] shadow-xs ring-2 ring-[#0F766E]'
                    : 'bg-white text-slate-800 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span
                    className={`text-[11px] font-mono font-bold ${
                      isPillarActive ? 'text-teal-300' : 'text-[#0F766E]'
                    }`}
                  >
                    PILLAR {pillar.pillarNumber}
                  </span>
                  <span
                    className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                      isPillarActive
                        ? 'bg-white/15 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {pillar.items.length} Tabs
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold leading-snug">
                  {pillar.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Connected Tree Diagram (Matching uploaded architecture blueprint) */}
        <div className="relative pt-2 pb-6 overflow-x-auto">
          <div className="min-w-[980px]">
            {/* Root Node & Tree Connector Lines */}
            <div className="flex flex-col items-center">
              <div className="px-6 py-2.5 rounded-xl bg-[#0D3B49] text-white font-semibold text-sm tracking-tight shadow-xs">
                Career360 Ecosystem · By Bytezen IT Solution
              </div>
              {/* Center vertical stem */}
              <div className="w-0.5 h-5 bg-slate-400" />
              {/* Horizontal tree bar spanning the 6 columns */}
              <div className="w-[84%] h-0.5 bg-slate-400" />
            </div>

            {/* 6 Columns Grid */}
            <div className="grid grid-cols-6 gap-3.5">
              {ECOSYSTEM_PILLARS.map((pillar) => {
                const isPillarSelected = selectedPillar.id === pillar.id;
                return (
                  <div
                    key={pillar.id}
                    className={`flex flex-col rounded-xl p-1.5 transition-colors ${
                      isPillarSelected ? 'bg-teal-50/70 ring-1 ring-[#0F766E]/40' : ''
                    }`}
                  >
                    {/* Vertical drop line from horizontal bar */}
                    <div
                      className={`w-0.5 h-4 mx-auto ${
                        isPillarSelected ? 'bg-[#0F766E]' : 'bg-slate-400'
                      }`}
                    />

                    {/* Pillar Header Box */}
                    <button
                      type="button"
                      onClick={() => handleSelectPillar(pillar)}
                      style={{ backgroundColor: pillar.headerBg }}
                      className={`w-full py-3.5 px-3 rounded-lg text-white font-semibold text-sm text-center shadow-xs hover:opacity-95 transition-all cursor-pointer mb-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                        isPillarSelected ? 'ring-2 ring-offset-2 ring-slate-900' : ''
                      }`}
                    >
                      {pillar.title}
                    </button>

                    {/* Sub-items list */}
                    <div className="flex flex-col gap-1.5">
                      {pillar.items.map((item) => {
                        const isSelected = selectedItem.id === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectNode(pillar, item)}
                            className={`w-full py-2.5 px-2.5 rounded-md text-xs font-medium text-center transition-all cursor-pointer whitespace-nowrap truncate ${
                              isSelected
                                ? 'bg-[#0F172A] text-white font-semibold shadow-xs ring-2 ring-[#0F766E]'
                                : isPillarSelected
                                ? 'bg-[#D5E8E8] text-slate-900 hover:bg-[#C2DFDF]'
                                : 'bg-[#E6F1F1] text-slate-800 hover:bg-[#D5E8E8]'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* INTERACTIVE PILLAR & SUB-TAB DEEP-DIVE CONTENT WORKSPACE */}
        <div
          id="pillar-content-panel"
          className="mt-6 rounded-2xl border-2 border-slate-200 bg-[#F8FAFC] overflow-hidden shadow-xs"
        >
          {/* Active Pillar Banner + Sub-Tab Navigation Strip */}
          <div className="bg-[#0D3B49] text-white p-5 sm:p-6 border-b border-slate-800">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/15">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-teal-300 font-mono mb-1">
                  <span>PILLAR {selectedPillar.pillarNumber} OF 06</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedPillar.pillarMetrics.totalModules}</span>
                  <span aria-hidden="true">·</span>
                  <span>Target: {selectedPillar.pillarMetrics.targetUsers}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {selectedPillar.title} — {selectedPillar.pillarMetrics.coreOutcome}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-3xl">
                  {selectedPillar.description}
                </p>
              </div>

              {/* Prev / Next Sub-Tab Controls */}
              <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
                <button
                  type="button"
                  onClick={handlePrevSubTab}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Prev Tab</span>
                </button>
                <span className="text-xs font-mono text-teal-200 px-2">
                  {currentItemIndex + 1} / {selectedPillar.items.length}
                </span>
                <button
                  type="button"
                  onClick={handleNextSubTab}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  <span>Next Tab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Clickable Sub-Tabs inside the Active Pillar */}
            <div className="pt-4">
              <p className="text-[11px] font-mono uppercase tracking-wider text-teal-300 mb-2.5">
                Select Stage or Service Tab inside {selectedPillar.title}:
              </p>
              <div
                role="tablist"
                aria-label={`${selectedPillar.title} Sub-Tabs`}
                className="flex flex-wrap gap-2"
              >
                {selectedPillar.items.map((item, idx) => {
                  const isSubActive = selectedItem.id === item.id;
                  return (
                    <button
                      key={`subtab-${item.id}`}
                      type="button"
                      role="tab"
                      aria-selected={isSubActive}
                      onClick={() => setSelectedItem(item)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSubActive
                          ? 'bg-[#14B8A6] text-slate-950 shadow-xs font-bold'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <span className="font-mono text-[10px] opacity-75">
                        0{idx + 1}.
                      </span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Sub-Tab Rich Content Body */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Top Row: Sub-Tab Title, Summary & 4 Key Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-[#0F766E] text-white font-semibold">
                    {selectedPillar.title} · {selectedItem.label}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-200 text-slate-800 font-medium">
                    Target Cohort: {selectedItem.cohortOrTarget}
                  </span>
                </div>

                <h4 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {selectedItem.headline}
                </h4>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedItem.summary}
                </p>

                {/* Focus Career / Skill / Exam Highlights */}
                <div className="pt-2">
                  <p className="text-xs font-bold text-slate-900 mb-2">
                    Core Focus Tracks, Skills & Benchmarks Covered in {selectedItem.label}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.careerOrSkillHighlights.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: 4 Key Metrics Grid + Direct Action Console */}
              <div className="lg:col-span-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                    <p className="text-[11px] font-medium text-slate-500">Duration & Format</p>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                      {selectedItem.metrics.duration}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                    <p className="text-[11px] font-medium text-slate-500">Delivery Mode</p>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                      {selectedItem.metrics.mode}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                    <p className="text-[11px] font-medium text-slate-500">Program / Fee Tier</p>
                    <p className="text-xs sm:text-sm font-bold font-mono text-[#0F766E] mt-1">
                      {selectedItem.metrics.feeOrTier}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                    <p className="text-[11px] font-medium text-slate-500">Primary Outcome</p>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                      {selectedItem.metrics.outcomeMetric}
                    </p>
                  </div>
                </div>

                {/* Action Console Card */}
                <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-3">
                  <p className="text-xs font-bold text-slate-900">
                    Immediate Next Steps for {selectedItem.label}:
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigateNode(selectedItem)}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#0F766E] text-white text-sm font-semibold hover:bg-[#115E59] transition-colors cursor-pointer"
                  >
                    <Compass className="w-4 h-4" />
                    <span>{selectedItem.recommendedActionLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (onBookCounsellingForNode) {
                          onBookCounsellingForNode(selectedItem, selectedPillar);
                        } else {
                          onNavigateNode({
                            ...selectedItem,
                            targetTab: 'counsellors',
                          });
                        }
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-[#0D3B49] text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book 1-on-1 Session</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (onRequestCallbackForNode) {
                          onRequestCallbackForNode(selectedItem, selectedPillar);
                        }
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#0F766E]" />
                      <span>Request Expert Callback</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Row: 4-Stage Execution Roadmap for the Selected Tab */}
            <div className="pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#0F766E]" />
                  <span>
                    How Career360 Executes {selectedItem.label} (4-Step Structured Pathway)
                  </span>
                </h5>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  Discovery → Psychometric Mapping → Human Validation → Skill Execution
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedItem.roadmapSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-[#0F766E]">
                          STEP 0{idx + 1}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-[#0F766E]" />
                      </div>
                      <p className="text-sm font-bold text-slate-900 mb-1.5">
                        {step.stepTitle.replace(/^0\d\.\s*/, '')}
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Row: Key Challenges Solved & Tangible Deliverables Included */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
              {/* Challenges Solved */}
              <div className="p-5 rounded-xl bg-white border border-slate-200">
                <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3.5">
                  <Target className="w-4 h-4 text-[#D94826]" />
                  <span>Key Challenges Solved for {selectedItem.cohortOrTarget}</span>
                </h5>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  {selectedItem.keyChallengesSolved.map((challenge, i) => (
                    <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                      <ShieldCheck className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deliverables Included */}
              <div className="p-5 rounded-xl bg-white border border-slate-200">
                <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3.5">
                  <FileText className="w-4 h-4 text-[#0F766E]" />
                  <span>Tangible Deliverables & Reports Included in {selectedItem.label}</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-800">
                  {selectedItem.deliverables.map((deliv, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-[#F0FDFA] border border-teal-200/80 flex items-start gap-2 font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
