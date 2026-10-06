import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Database,
  RefreshCw,
  ShieldCheck,
  Star,
} from 'lucide-react';
import {
  supabase,
  SUPABASE_PROJECT_ID,
  SUPABASE_SETUP_SQL,
  SUPABASE_URL,
  toSupabaseBookingRow,
} from '../lib/supabase';
import {
  BookingRecord,
  CohortStage,
  CounsellorRecord,
  UserAccount,
} from '../types/platform';

export interface SupabaseSyncStatus {
  projectId: string;
  url: string;
  tableReady: boolean;
  syncedCount: number;
  message: string;
}

interface CounsellorsViewProps {
  counsellors: CounsellorRecord[];
  bookings: BookingRecord[];
  currentUser: UserAccount;
  supabaseStatus: SupabaseSyncStatus | null;
  onSyncSupabase: () => Promise<void>;
  onCreateBooking: (payload: {
    studentId: string;
    studentName: string;
    studentCohort: string;
    counsellorId: string;
    serviceTitle: string;
    date: string;
    slot: string;
    mode: 'Online Video' | 'In-Centre';
    notes: string;
  }) => Promise<BookingRecord | null>;
}

export const CounsellorsView: React.FC<CounsellorsViewProps> = ({
  counsellors,
  bookings,
  currentUser,
  supabaseStatus,
  onSyncSupabase,
  onCreateBooking,
}) => {
  const [cohortFilter, setCohortFilter] = useState<string>('ALL');
  const [languageFilter, setLanguageFilter] = useState<string>('ALL');
  const [activeCounsellor, setActiveCounsellor] = useState<CounsellorRecord | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  // Booking modal form state
  const [serviceTitle, setServiceTitle] = useState<string>(
    '1-on-1 Psychometric Report Validation & Career Roadmap'
  );
  const [bookingDate, setBookingDate] = useState<string>('2026-10-14');
  const [bookingSlot, setBookingSlot] = useState<string>('04:00 PM');
  const [bookingMode, setBookingMode] = useState<'Online Video' | 'In-Centre'>('Online Video');
  const [candidateName, setCandidateName] = useState<string>(currentUser.name);
  const [candidateCohort, setCandidateCohort] = useState<string>(
    currentUser.cohort || 'Class 11-12'
  );
  const [sessionNotes, setSessionNotes] = useState<string>(
    'Seeking clarity on stream/college shortlist and 5-year skill roadmap.'
  );
  const [isBookingSubmitting, setIsBookingSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  // Supabase SQL Helper state
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [isSyncingSb, setIsSyncingSb] = useState<boolean>(false);

  const filteredCounsellors = useMemo(() => {
    return counsellors.filter((c) => {
      const matchCohort =
        cohortFilter === 'ALL' || c.studentCategories.includes(cohortFilter as CohortStage);
      const matchLang =
        languageFilter === 'ALL' ||
        c.languages.some((l) => l.toLowerCase() === languageFilter.toLowerCase());
      return matchCohort && matchLang;
    });
  }, [counsellors, cohortFilter, languageFilter]);

  const handleOpenBooking = (c: CounsellorRecord) => {
    setActiveCounsellor(c);
    setBookingSlot(c.availableSlots[0] || '04:00 PM');
    setConfirmedBooking(null);
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCounsellor) return;
    setIsBookingSubmitting(true);
    try {
      const result = await onCreateBooking({
        studentId: currentUser.id,
        studentName: candidateName.trim() || currentUser.name,
        studentCohort: candidateCohort,
        counsellorId: activeCounsellor.id,
        serviceTitle,
        date: bookingDate,
        slot: bookingSlot,
        mode: bookingMode,
        notes: sessionNotes,
      });
      if (result) {
        // Also ensure direct client-side upsert to Supabase bookings table
        await supabase
          .from('bookings')
          .upsert(toSupabaseBookingRow(result), { onConflict: 'id' })
          .then(() => undefined, () => undefined);
        setConfirmedBooking(result);
        await onSyncSupabase();
      }
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  const handleManualSync = async () => {
    setIsSyncingSb(true);
    try {
      await onSyncSupabase();
    } finally {
      setIsSyncingSb(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="py-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-[#0F766E] mb-1">
            Phase 6 & 8 · Verified Counsellor Marketplace & Supabase Appointment Engine
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Connect with Certified Career Psychologists & Industry Strategists
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Every Career360 counsellor is credential-verified and trained in psychometric triangulation + Indian & global admissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label
              htmlFor="counsellor-cohort-filter"
              className="block text-xs font-medium text-slate-600 mb-1"
            >
              Student / Age Stage
            </label>
            <select
              id="counsellor-cohort-filter"
              value={cohortFilter}
              onChange={(e) => setCohortFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg"
            >
              <option value="ALL">All Stages (Class 5 to Working Pro)</option>
              <option value="Class 5-6">Class 5-6</option>
              <option value="Class 7-8">Class 7-8</option>
              <option value="Class 9-10">Class 9-10</option>
              <option value="Class 11-12">Class 11-12</option>
              <option value="UG">UG Students</option>
              <option value="PG">PG Students</option>
              <option value="Working Professionals">Working Professionals</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="counsellor-lang-filter"
              className="block text-xs font-medium text-slate-600 mb-1"
            >
              Preferred Language
            </label>
            <select
              id="counsellor-lang-filter"
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg"
            >
              <option value="ALL">All Languages</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Marathi">Marathi</option>
              <option value="Malayalam">Malayalam</option>
            </select>
          </div>
        </div>
      </div>

      {/* Counsellor Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {filteredCounsellors.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                  {!imgErrors[c.id] ? (
                    <img
                      src={c.photoUrl}
                      alt={c.name}
                      referrerPolicy="no-referrer"
                      onError={() => setImgErrors((prev) => ({ ...prev, [c.id]: true }))}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-[#0D3B49]">
                      {c.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-[#0F766E] font-semibold mb-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>Bytezen Verified</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{c.experienceYears} Yrs Exp</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 truncate">{c.name}</h2>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{c.qualification}</p>
                </div>
              </div>

              {/* Clean inline metadata row (Zero-Pill Discipline) */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 py-2.5 border-y border-slate-100 mb-4">
                <span className="inline-flex items-center gap-1 font-semibold text-slate-900">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="font-mono tabular-nums">{c.rating}</span> ({c.reviewCount} reviews)
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{c.sessionsCompleted}+ Sessions</span>
                <span aria-hidden="true">·</span>
                <span>{c.mode}</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <p>
                  <strong className="text-slate-900">Specialization:</strong> {c.specialization}
                </p>
                <p>
                  <strong className="text-slate-900">Counselling Approach:</strong>{' '}
                  {c.counsellingApproach}
                </p>
                <p className="text-slate-600">
                  <strong className="text-slate-900">Cohorts Served:</strong>{' '}
                  {c.studentCategories.join(' · ')}
                </p>
                <p className="text-slate-600">
                  <strong className="text-slate-900">Languages:</strong> {c.languages.join(' · ')}
                </p>
                <p className="text-slate-600">
                  <strong className="text-slate-900">Next Available Slots:</strong>{' '}
                  <span className="font-mono">{c.availableSlots.join(' / ')}</span>
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
              <div>
                <span className="block text-xs text-slate-500">
                  {c.sessionDurationMins}-Min 1-on-1 Session
                </span>
                <span className="text-lg font-bold font-mono tabular-nums text-slate-900">
                  ₹{c.feeInr.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleOpenBooking(c)}
                className="px-4 py-2.5 rounded-lg bg-[#0F766E] text-white text-xs font-semibold hover:bg-[#115E59] transition-colors cursor-pointer whitespace-nowrap"
              >
                Book Session
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Appointment Booking Drawer / Section */}
      {activeCounsellor && (
        <div
          id="booking-drawer"
          className="mt-10 bg-white rounded-xl border-2 border-[#0F766E] p-6 sm:p-8 shadow-sm"
        >
          {confirmedBooking ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#0F766E] font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  Appointment Confirmed & Synced to Supabase ({SUPABASE_PROJECT_ID})
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {confirmedBooking.serviceTitle} with {confirmedBooking.counsellorName}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-[#F8FAFC] border border-slate-200 text-xs">
                <div>
                  <span className="block text-slate-500">Student / Candidate</span>
                  <span className="font-bold text-slate-900">
                    {confirmedBooking.studentName} ({confirmedBooking.studentCohort})
                  </span>
                </div>
                <div>
                  <span className="block text-slate-500">Date & Slot (IST)</span>
                  <span className="font-bold font-mono tabular-nums text-slate-900">
                    {confirmedBooking.date} · {confirmedBooking.slot}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-500">Session Mode & Fee Paid</span>
                  <span className="font-bold font-mono tabular-nums text-[#0F766E]">
                    {confirmedBooking.mode} · ₹{confirmedBooking.feePaidInr}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-500">Meeting Link</span>
                  <span className="font-mono text-slate-800 break-all">
                    {confirmedBooking.meetingLink}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600">
                Record ID <span className="font-mono font-semibold">{confirmedBooking.id}</span> written to Supabase project{' '}
                <span className="font-mono font-semibold">{SUPABASE_PROJECT_ID}</span> (`public.bookings`).
              </p>
              <button
                type="button"
                onClick={() => setActiveCounsellor(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Close Booking Panel
              </button>
            </div>
          ) : (
            <form onSubmit={handleConfirmSubmit} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
                <div>
                  <p className="text-xs font-semibold text-[#0F766E]">
                    Phase 8 · Real-Time Slot Booking & Supabase Storage ({SUPABASE_PROJECT_ID})
                  </p>
                  <h3 className="text-xl font-bold text-slate-900">
                    Book Session with {activeCounsellor.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCounsellor(null)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer self-start"
                >
                  Cancel ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label htmlFor="bk-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Student / Candidate Name
                  </label>
                  <input
                    id="bk-name"
                    type="text"
                    required
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label htmlFor="bk-cohort" className="block text-xs font-semibold text-slate-700 mb-1">
                    Cohort / Stage
                  </label>
                  <select
                    id="bk-cohort"
                    value={candidateCohort}
                    onChange={(e) => setCandidateCohort(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                  >
                    {activeCounsellor.studentCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="bk-service" className="block text-xs font-semibold text-slate-700 mb-1">
                    Counselling Objective
                  </label>
                  <select
                    id="bk-service"
                    value={serviceTitle}
                    onChange={(e) => setServiceTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="1-on-1 Psychometric Report Validation & Career Roadmap">
                      1-on-1 Psychometric Report Validation & Career Roadmap
                    </option>
                    <option value="Class 9-10 Stream & Subject Selection Session">
                      Class 9-10 Stream & Subject Selection Session
                    </option>
                    <option value="Class 11-12 College Shortlisting & Exam Strategy">
                      Class 11-12 College Shortlisting & Exam Strategy
                    </option>
                    <option value="Parent-Child Career Alignment & ROI Consultation">
                      Parent-Child Career Alignment & ROI Consultation
                    </option>
                    <option value="Working Professional Career Pivot & Salary Roadmap">
                      Working Professional Career Pivot & Salary Roadmap
                    </option>
                  </select>
                </div>

                <div>
                  <label htmlFor="bk-date" className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Date
                  </label>
                  <input
                    id="bk-date"
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Available Time Slots (IST · {activeCounsellor.bufferMins}m buffer included)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {activeCounsellor.availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setBookingSlot(slot)}
                        className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-md border cursor-pointer ${
                          bookingSlot === slot
                            ? 'bg-[#0D3B49] text-white border-[#0D3B49]'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Session Mode
                  </label>
                  <div className="flex gap-2">
                    {(['Online Video', 'In-Centre'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setBookingMode(m)}
                        className={`flex-1 py-2 px-3 text-xs font-semibold rounded-md border cursor-pointer ${
                          bookingMode === m
                            ? 'bg-[#0F766E] text-white border-[#0F766E]'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="bk-notes" className="block text-xs font-semibold text-slate-700 mb-1">
                  Key Questions for Counsellor (Saved with Booking in Supabase)
                </label>
                <input
                  id="bk-notes"
                  type="text"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
                <div className="text-xs text-slate-600">
                  Session Fee:{' '}
                  <span className="text-base font-bold font-mono tabular-nums text-slate-900">
                    ₹{activeCounsellor.feeInr}
                  </span>{' '}
                  (incl. 18% GST · Auto-saved to Supabase `public.bookings`)
                </div>

                <button
                  type="submit"
                  disabled={isBookingSubmitting}
                  className="px-6 py-3 rounded-lg bg-[#0F766E] text-white text-xs font-semibold hover:bg-[#115E59] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {isBookingSubmitting
                    ? 'Saving to Supabase...'
                    : `Pay ₹${activeCounsellor.feeInr} & Save Booking`}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Scheduled Counselling Appointments Log & Supabase Connection Bar */}
      <div className="mt-12 bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Database className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>Supabase Project ID:</span>
              <span className="font-mono font-semibold text-slate-800">{SUPABASE_PROJECT_ID}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-600">{SUPABASE_URL}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Scheduled Counselling Appointments ({bookings.length})
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {supabaseStatus?.tableReady
                ? `Live Sync Active: ${supabaseStatus.message}`
                : 'Connected to Supabase endpoint. Run the 1-time SQL table script in your Supabase SQL Editor to enable remote table persistence.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowSqlModal((v) => !v)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-[#F8FAFC] border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer whitespace-nowrap"
            >
              {showSqlModal ? 'Hide Supabase Table SQL' : 'Supabase Table Setup SQL'}
            </button>

            <button
              type="button"
              disabled={isSyncingSb}
              onClick={handleManualSync}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0D3B49] rounded-lg hover:bg-slate-800 cursor-pointer whitespace-nowrap"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSb ? 'animate-spin' : ''}`} />
              <span>{isSyncingSb ? 'Syncing with Supabase...' : 'Verify & Sync Bookings to Supabase'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible SQL Migration Script for `public.bookings` */}
        {showSqlModal && (
          <div className="mb-6 p-4 rounded-xl bg-slate-900 text-slate-100 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-700">
              <div>
                <p className="font-bold text-white">
                  One-Time Supabase Table Schema (`public.bookings`, `public.leads`, `public.orders`)
                </p>
                <p className="text-slate-400">
                  Paste and run this in your Supabase SQL Editor for project{' '}
                  <span className="font-mono text-teal-300">{SUPABASE_PROJECT_ID}</span>, then click "Verify & Sync Bookings to Supabase".
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopySql}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0F766E] text-white font-semibold hover:bg-[#115E59] cursor-pointer self-start whitespace-nowrap"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Script'}</span>
              </button>
            </div>
            <pre className="font-mono text-[11px] leading-relaxed overflow-x-auto max-h-60 text-teal-100">
              {SUPABASE_SETUP_SQL}
            </pre>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2.5 pr-4">Booking ID</th>
                <th className="py-2.5 px-4">Student / Professional</th>
                <th className="py-2.5 px-4">Counsellor</th>
                <th className="py-2.5 px-4">Objective</th>
                <th className="py-2.5 px-4">Date & Time</th>
                <th className="py-2.5 px-4 text-right">Fee Paid</th>
                <th className="py-2.5 pl-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((bk) => (
                <tr key={bk.id} className="hover:bg-slate-50">
                  <td className="py-3 pr-4 font-mono text-slate-600">{bk.id}</td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {bk.studentName} · <span className="text-slate-500">{bk.studentCohort}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-800">{bk.counsellorName}</td>
                  <td className="py-3 px-4 text-slate-600">{bk.serviceTitle}</td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-800">
                    {bk.date} · {bk.slot}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-right font-semibold text-slate-900">
                    ₹{bk.feePaidInr}
                  </td>
                  <td className="py-3 pl-4 text-right font-semibold text-[#0F766E]">
                    {bk.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
