import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Compass, Layers } from 'lucide-react';
import { ECOSYSTEM_PILLARS } from '../data/seedData';
import { EcosystemNodeItem, EcosystemPillar } from '../types/platform';

interface EcosystemMatrixProps {
  onNavigateNode: (item: EcosystemNodeItem) => void;
}

export const EcosystemMatrix: React.FC<EcosystemMatrixProps> = ({ onNavigateNode }) => {
  const [selectedPillar, setSelectedPillar] = useState<EcosystemPillar>(ECOSYSTEM_PILLARS[0]);
  const [selectedItem, setSelectedItem] = useState<EcosystemNodeItem>(ECOSYSTEM_PILLARS[0].items[2]); // Default Class 9-10

  const handleSelectNode = (pillar: EcosystemPillar, item: EcosystemNodeItem) => {
    setSelectedPillar(pillar);
    setSelectedItem(item);
  };

  return (
    <section id="ecosystem-architecture" className="py-16 border-b border-slate-200 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-xs font-medium text-[#0F766E] tracking-wide mb-2">
              01. Unified Career360 Ecosystem Architecture · Interactive Map
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Six Pillars Connecting Every Stage of Career & Skill Readiness
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-md">
            Select any stage or service node in the architecture chart below to inspect deliverables or launch that workflow immediately.
          </p>
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
              {ECOSYSTEM_PILLARS.map((pillar) => (
                <div key={pillar.id} className="flex flex-col">
                  {/* Vertical drop line from horizontal bar */}
                  <div className="w-0.5 h-4 bg-slate-400 mx-auto" />

                  {/* Pillar Header Box */}
                  <button
                    type="button"
                    onClick={() => handleSelectNode(pillar, pillar.items[0])}
                    style={{ backgroundColor: pillar.headerBg }}
                    className="w-full py-3.5 px-3 rounded-lg text-white font-semibold text-sm text-center shadow-xs hover:opacity-95 transition-opacity cursor-pointer mb-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
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
                              ? 'bg-[#0F172A] text-white shadow-xs ring-2 ring-[#0F766E]'
                              : 'bg-[#E6F1F1] text-slate-800 hover:bg-[#D5E8E8]'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Node Detail Inspector */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-[#F8FAFC] p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <Layers className="w-3.5 h-3.5 text-[#0F766E]" />
                <span className="font-semibold text-slate-800">{selectedPillar.title}</span>
                <span aria-hidden="true">·</span>
                <span>Target Cohort: {selectedItem.cohortOrTarget}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                {selectedItem.label} — Structured Guidance & Deliverables
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {selectedItem.summary}
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-700">
                {selectedItem.deliverables.map((deliv, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                    {deliv}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-end gap-3 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-6">
              <div className="text-left lg:text-right mb-1">
                <p className="text-xs text-slate-500"> Lifecycle Progression</p>
                <p className="text-xs font-medium text-slate-800">
                  Discovery → Psychometric Profile → Counsellor Roadmap → Skill Execution
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateNode(selectedItem)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#0F766E] text-white text-sm font-semibold hover:bg-[#115E59] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Compass className="w-4 h-4" />
                <span>{selectedItem.recommendedActionLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
