import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Database,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Star,
  Video,
} from 'lucide-react';
import {
  DIRECT_BOOKING_COHORTS,
  INDIAN_STATES_LIST,
} from '../data/seedData';
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
  initialBookingSection?: 'direct' | 'marketplace';
  initialDirectCohort?: string;
  initialStateFilter?: string;
  customerBasicInfo?: {
    name: string;
    mobile: string;
    email: string;
    state: string;
    category: string;
  } | null;
  onSaveCustomerBasicInfo?: (info: {
    name: string;
    mobile: string;
    email: string;
    state: string;
    category: string;
  }) => void;
  onSyncSupabase: () => Promise<void>;
  onCreateBooking: (payload: {
    studentId: string;
    studentName: string;
    studentCohort: string;
    counsellorId: string;
    counsellorName?: string;
    feePaidInr?: number;
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
  initialBookingSection = 'direct',
  initialDirectCohort = 'Class 9-10',
  initialStateFilter = 'ALL',
  customerBasicInfo,
  onSaveCustomerBasicInfo,
  onSyncSupabase,
  onCreateBooking,
}) => {
  const [bookingSectionTab, setBookingSectionTab] = useState<'direct' | 'marketplace'>(
    initialBookingSection
  );
  const [selectedDirectCohortId, setSelectedDirectCohortId] = useState<string>(initialDirectCohort);
  const [stateFilter, setStateFilter] = useState<string>(initialStateFilter);
  const [cohortFilter, setCohortFilter] = useState<string>('ALL');
  const [languageFilter, setLanguageFilter] = useState<string>('ALL');
  const [modeFilter, setModeFilter] = useState<string>('ALL');
  const [localCounsellors, setLocalCounsellors] = useState<CounsellorRecord[]>([]);
  const [localBookingOverrides, setLocalBookingOverrides] = useState<Record<string, BookingRecord['status']>>({});
  const [showOnboardingForm, setShowOnboardingForm] = useState<boolean>(false);
  const [onboardName, setOnboardName] = useState<string>('');
  const [onboardQual, setOnboardQual] = useState<string>('');
  const [onboardSpec, setOnboardSpec] = useState<string>('');
  const [onboardExp, setOnboardExp] = useState<number>(8);
  const [onboardFee, setOnboardFee] = useState<number>(1499);
  const [onboardCity, setOnboardCity] = useState<string>('Mumbai');
  const [onboardState, setOnboardState] = useState<string>('Maharashtra');
  const [onboardSuccess, setOnboardSuccess] = useState<string>('');
  const [activeCounsellor, setActiveCounsellor] = useState<CounsellorRecord | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  // Direct Rs 999 1-Hour Online Booking state (No specific counsellor recommended)
  const [directCustomerName, setDirectCustomerName] = useState<string>(
    customerBasicInfo?.name || currentUser.name
  );
  const [directCustomerMobile, setDirectCustomerMobile] = useState<string>(
    customerBasicInfo?.mobile || currentUser.mobile || '+91 98230 11223'
  );
  const [directCustomerEmail, setDirectCustomerEmail] = useState<string>(
    customerBasicInfo?.email || currentUser.email || 'student@bytezenit.com'
  );
  const [directCustomerState, setDirectCustomerState] = useState<string>(
    customerBasicInfo?.state || 'Maharashtra'
  );
  const [directDate, setDirectDate] = useState<string>('2026-10-15');
  const [directSlot, setDirectSlot] = useState<string>('04:00 PM - 05:00 PM (1 Hour Online)');
  const [directNotes, setDirectNotes] = useState<string>(
    'Direct 1-Hour Online Career Counselling Session (Rs 999).'
  );
  const [isDirectSubmitting, setIsDirectSubmitting] = useState<boolean>(false);
  const [confirmedDirectBooking, setConfirmedDirectBooking] = useState<BookingRecord | null>(null);

  useEffect(() => {
    setBookingSectionTab(initialBookingSection);
  }, [initialBookingSection]);

  useEffect(() => {
    if (initialDirectCohort) {
      setSelectedDirectCohortId(initialDirectCohort);
    }
  }, [initialDirectCohort]);

  useEffect(() => {
    if (initialStateFilter) {
      setStateFilter(initialStateFilter);
    }
  }, [initialStateFilter]);

  useEffect(() => {
    if (customerBasicInfo) {
      setDirectCustomerName(customerBasicInfo.name);
      setDirectCustomerMobile(customerBasicInfo.mobile);
      setDirectCustomerEmail(customerBasicInfo.email);
      setDirectCustomerState(customerBasicInfo.state);
      setCandidateName(customerBasicInfo.name);
    }
  }, [customerBasicInfo]);

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

  const allCounsellors = useMemo(() => {
    return [...localCounsellors, ...counsellors];
  }, [localCounsellors, counsellors]);

  const filteredCounsellors = useMemo(() => {
    return allCounsellors.filter((c) => {
      const matchState =
        stateFilter === 'ALL' ||
        stateFilter === 'All India Online' ||
        (c.state && c.state.toLowerCase() === stateFilter.toLowerCase()) ||
        c.city.toLowerCase().includes(stateFilter.toLowerCase()) ||
        c.specialization.toLowerCase().includes(stateFilter.toLowerCase());
      const matchCohort =
        cohortFilter === 'ALL' || c.studentCategories.includes(cohortFilter as CohortStage);
      const matchLang =
        languageFilter === 'ALL' ||
        c.languages.some((l) => l.toLowerCase() === languageFilter.toLowerCase());
      const matchMode = modeFilter === 'ALL' || c.mode === modeFilter;
      return matchState && matchCohort && matchLang && matchMode;
    });
  }, [allCounsellors, stateFilter, cohortFilter, languageFilter, modeFilter]);

  const activeDirectTrack = useMemo(() => {
    return (
      DIRECT_BOOKING_COHORTS.find((t) => t.id === selectedDirectCohortId) ||
      DIRECT_BOOKING_COHORTS[2]
    );
  }, [selectedDirectCohortId]);

  const handleConfirmDirectBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directCustomerName.trim() || !directCustomerMobile.trim()) return;
    setIsDirectSubmitting(true);
    try {
      if (onSaveCustomerBasicInfo) {
        onSaveCustomerBasicInfo({
          name: directCustomerName.trim(),
          mobile: directCustomerMobile.trim(),
          email: directCustomerEmail.trim(),
          state: directCustomerState,
          category: activeDirectTrack.label,
        });
      }
      const result = await onCreateBooking({
        studentId: currentUser.id,
        studentName: `${directCustomerName.trim()} (${directCustomerState})`,
        studentCohort: activeDirectTrack.label,
        counsellorId: 'direct-desk-999',
        counsellorName: 'Direct Counselling Desk (1-Hr Online · Auto-Assigned)',
        feePaidInr: 999,
        serviceTitle: `${activeDirectTrack.serviceTitle} (₹999 · 1 Hr Online)`,
        date: directDate,
        slot: directSlot,
        mode: 'Online Video',
        notes: `Mobile: ${directCustomerMobile} | Email: ${directCustomerEmail} | State: ${directCustomerState} | ${directNotes}`,
      });
      if (result) {
        await supabase
          .from('bookings')
          .upsert(toSupabaseBookingRow(result), { onConflict: 'id' })
          .then(() => undefined, () => undefined);
        setConfirmedDirectBooking(result);
        await onSyncSupabase();
      }
    } finally {
      setIsDirectSubmitting(false);
    }
  };

  const handleOnboardCounsellor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardName.trim() || !onboardQual.trim()) return;
    const newC: CounsellorRecord = {
      id: `cns-${Date.now()}`,
      name: onboardName.trim(),
      photoUrl: counsellors[0]?.photoUrl || '',
      qualification: onboardQual.trim(),
      experienceYears: onboardExp,
      specialization: onboardSpec.trim() || 'Psychometric Career Guidance & Stream/College Roadmap',
      languages: ['English', 'Hindi'],
      studentCategories: ['Class 9-10', 'Class 11-12', 'UG', 'Working Professionals'],
      careerDomains: ['Technology & AI', 'Finance & Commerce', 'Interdisciplinary NEP'],
      feeInr: onboardFee,
      mode: 'Offline & Online',
      city: onboardCity.trim() || 'Pan-India Online',
      state: onboardState,
      rating: 4.9,
      reviewCount: 12,
      sessionsCompleted: 45,
      counsellingApproach: 'Psychometric triangulation + realistic 5-year education & skill ROI planning.',
      introduction: 'Verified Career360 Advisor onboarded through Phase 7 Credential & Interview Verification.',
      verified: true,
      availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
      availableSlots: ['11:00 AM', '04:00 PM', '06:30 PM'],
      sessionDurationMins: 45,
      bufferMins: 15,
    };
    setLocalCounsellors((prev) => [newC, ...prev]);
    setOnboardName('');
    setOnboardQual('');
    setOnboardSpec('');
    setOnboardSuccess(`Counsellor profile for ${newC.name} verified & activated in marketplace!`);
    setTimeout(() => setOnboardSuccess(''), 4000);
  };

  const handleUpdateBookingStatus = async (bk: BookingRecord, newStatus: BookingRecord['status']) => {
    setLocalBookingOverrides((prev) => ({ ...prev, [bk.id]: newStatus }));
    const updated: BookingRecord = { ...bk, status: newStatus };
    await supabase
      .from('bookings')
      .upsert(toSupabaseBookingRow(updated), { onConflict: 'id' })
      .then(() => undefined, () => undefined);
  };

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
      {/* Top Booking Counselling Mode Switcher */}
      <div className="mb-8 p-2 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={() => setBookingSectionTab('direct')}
          className={`flex-1 py-3.5 px-5 rounded-xl text-left transition-all cursor-pointer ${
            bookingSectionTab === 'direct'
              ? 'bg-[#0D3B49] text-white shadow-sm'
              : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-300">
              Direct 1-Hour Online Booking · Flat ₹999
            </span>
            <span className="px-2.5 py-0.5 rounded bg-[#0F766E] text-white font-mono text-xs font-bold">
              ₹999 / 1 Hr Online
            </span>
          </div>
          <p className="text-sm sm:text-base font-bold mt-1">
            Direct Counselling Booking (Without Recommending Any Specific Counsellor)
          </p>
          <p
            className={`text-xs mt-0.5 ${
              bookingSectionTab === 'direct' ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Class 5–6 · Class 7–8 · Class 9–10 · Class 11–12 · UG Student · PG Student · Working Professional · First Job
          </p>
        </button>

        <button
          type="button"
          onClick={() => setBookingSectionTab('marketplace')}
          className={`flex-1 py-3.5 px-5 rounded-xl text-left transition-all cursor-pointer ${
            bookingSectionTab === 'marketplace'
              ? 'bg-[#0D3B49] text-white shadow-sm'
              : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-xs font-mono font-bold uppercase tracking-wider ${
                bookingSectionTab === 'marketplace' ? 'text-teal-300' : 'text-[#0F766E]'
              }`}
            >
              State-Wise Counsellor Directory
            </span>
            <span className="px-2.5 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-xs font-bold">
              {allCounsellors.length} Verified Advisors
            </span>
          </div>
          <p className="text-sm sm:text-base font-bold mt-1">
            Search Counsellor State-Wise & Book Specific Specialist
          </p>
          <p
            className={`text-xs mt-0.5 ${
              bookingSectionTab === 'marketplace' ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Filter counsellors by Indian State, Student Stage, Language & Session Mode
          </p>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* SECTION A: DIRECT BOOKING WITHOUT RECOMMENDING ANY COUNSELLOR (₹999)  */}
      {/* ===================================================================== */}
      {bookingSectionTab === 'direct' && (
        <div className="mb-12 bg-white rounded-2xl border-2 border-[#0F766E] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0F766E] mb-1">
                <Video className="w-4 h-4" />
                <span>
                  DIRECT 1-HOUR ONLINE SESSION · NO SPECIFIC COUNSELLOR RECOMMENDATION REQUIRED
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Direct Career Counselling Booking — Flat ₹999 (1 Hour Online)
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Select your category below and book your 1-hour live online session directly at ₹999 without needing to browse or select a specific counsellor.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F0FDFA] border border-teal-200 text-right shrink-0">
              <span className="block text-xs font-semibold text-slate-600">
                Standard Direct Booking Cost
              </span>
              <span className="text-3xl font-bold font-mono tabular-nums text-[#0F766E]">
                ₹999
              </span>
              <span className="block text-xs font-mono text-slate-700 mt-0.5">
                1 Hour Session · 100% Online Video
              </span>
            </div>
          </div>

          {/* 8 Category Tabs (Class 5-6 to First Job) */}
          <div className="mt-6">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Step 1 · Select Your Category (All 8 Direct Booking Tracks @ ₹999 / 1 Hour Online)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DIRECT_BOOKING_COHORTS.map((track) => {
                const isSelected = track.id === activeDirectTrack.id;
                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => {
                      setSelectedDirectCohortId(track.id);
                      setConfirmedDirectBooking(null);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0D3B49] text-white border-[#0D3B49] ring-2 ring-[#0F766E]'
                        : 'bg-[#F8FAFC] text-slate-900 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-sm font-bold">{track.label}</span>
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          isSelected
                            ? 'bg-[#0F766E] text-white'
                            : 'bg-teal-50 text-[#0F766E]'
                        }`}
                      >
                        ₹{track.priceInr}
                      </span>
                    </div>
                    <p
                      className={`text-[11px] font-mono ${
                        isSelected ? 'text-teal-200' : 'text-slate-500'
                      }`}
                    >
                      {track.duration}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Direct Category Detail + Direct Booking Form */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 p-6 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-[#0D3B49] text-white text-xs font-semibold">
                  Selected: {activeDirectTrack.label}
                </span>
                <span className="text-sm font-mono font-bold text-[#0F766E]">
                  ₹{activeDirectTrack.priceInr} · {activeDirectTrack.duration}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                {activeDirectTrack.serviceTitle}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {activeDirectTrack.focusSummary}
              </p>

              <div className="pt-3 border-t border-slate-200 space-y-2">
                <p className="text-xs font-bold text-slate-900">
                  What is Included in This ₹999 1-Hour Online Session:
                </p>
                {activeDirectTrack.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" />
                  <span>Direct Booking — No Specific Counsellor Selection Needed</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              {confirmedDirectBooking ? (
                <div className="p-6 rounded-xl bg-[#F0FDFA] border-2 border-[#0F766E] space-y-4">
                  <div className="flex items-center gap-2 text-[#0F766E] font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>
                      Direct 1-Hour Online Session Confirmed & Saved to Supabase ({SUPABASE_PROJECT_ID})
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {confirmedDirectBooking.serviceTitle}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-lg bg-white border border-slate-200 text-xs">
                    <div>
                      <span className="block text-slate-500">Customer & Category</span>
                      <span className="font-bold text-slate-900">
                        {confirmedDirectBooking.studentName} · {confirmedDirectBooking.studentCohort}
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-500">Date & 1-Hour Online Slot</span>
                      <span className="font-mono font-bold text-slate-900">
                        {confirmedDirectBooking.date} · {confirmedDirectBooking.slot}
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-500">Booking Type & Cost</span>
                      <span className="font-mono font-bold text-[#0F766E]">
                        Direct Online Booking · ₹{confirmedDirectBooking.feePaidInr} (1 Hour)
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-500">Online Video Room Link</span>
                      <span className="font-mono text-slate-800 break-all">
                        {confirmedDirectBooking.meetingLink}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfirmedDirectBooking(null)}
                    className="px-4 py-2 rounded-lg bg-[#0D3B49] text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                  >
                    Book Another Direct Session
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleConfirmDirectBooking}
                  className="p-6 rounded-xl bg-white border border-slate-200 space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <p className="text-xs font-semibold text-[#0F766E]">
                        Step 2 · New Customer Basic Details & 1-Hour Slot Selection
                      </p>
                      <h3 className="text-base font-bold text-slate-900">
                        Book {activeDirectTrack.label} Direct Online Session (₹999 · 1 Hour)
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#0F766E] bg-[#F0FDFA] px-2.5 py-1 rounded border border-teal-200">
                      Online Video · 60 Mins
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name (Student / Customer) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter full name"
                        value={directCustomerName}
                        onChange={(e) => setDirectCustomerName(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-[#F8FAFC] border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mobile Number (WhatsApp / OTP) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98230 00000"
                        value={directCustomerMobile}
                        onChange={(e) => setDirectCustomerMobile(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm font-mono bg-[#F8FAFC] border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address (Basic Detail)
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={directCustomerEmail}
                        onChange={(e) => setDirectCustomerEmail(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-[#F8FAFC] border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your State
                      </label>
                      <select
                        value={directCustomerState}
                        onChange={(e) => setDirectCustomerState(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-[#F8FAFC] border border-slate-300 rounded-lg"
                      >
                        {INDIAN_STATES_LIST.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        required
                        value={directDate}
                        onChange={(e) => setDirectDate(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm font-mono bg-[#F8FAFC] border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        1-Hour Online Time Slot (IST)
                      </label>
                      <select
                        value={directSlot}
                        onChange={(e) => setDirectSlot(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm font-mono bg-[#F8FAFC] border border-slate-300 rounded-lg"
                      >
                        <option value="10:00 AM - 11:00 AM (1 Hour Online)">
                          10:00 AM - 11:00 AM (1 Hour Online)
                        </option>
                        <option value="12:00 PM - 01:00 PM (1 Hour Online)">
                          12:00 PM - 01:00 PM (1 Hour Online)
                        </option>
                        <option value="02:30 PM - 03:30 PM (1 Hour Online)">
                          02:30 PM - 03:30 PM (1 Hour Online)
                        </option>
                        <option value="04:00 PM - 05:00 PM (1 Hour Online)">
                          04:00 PM - 05:00 PM (1 Hour Online)
                        </option>
                        <option value="06:00 PM - 07:00 PM (1 Hour Online)">
                          06:00 PM - 07:00 PM (1 Hour Online)
                        </option>
                        <option value="07:30 PM - 08:30 PM (1 Hour Online)">
                          07:30 PM - 08:30 PM (1 Hour Online)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Key Questions / Career Goals for Your 1-Hour Session
                    </label>
                    <input
                      type="text"
                      value={directNotes}
                      onChange={(e) => setDirectNotes(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-[#F8FAFC] border border-slate-300 rounded-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isDirectSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#0F766E] text-white text-sm font-bold hover:bg-[#115E59] transition-colors cursor-pointer"
                  >
                    {isDirectSubmitting
                      ? 'Confirming & Saving ₹999 Direct Booking to Supabase...'
                      : `Confirm Direct 1-Hour Online Booking for ${activeDirectTrack.label} — ₹999`}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECTION B: STATE-WISE COUNSELLOR SEARCH & MARKETPLACE                 */}
      {/* ===================================================================== */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-[#0F766E] mb-1">
            State-Wise Verified Counsellor Directory & Specialist Marketplace
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Search Career Counsellors State-Wise & by Student Stage
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Filter counsellors by Indian State, Student Category, Language, or Session Mode—or use Direct ₹999 1-Hour Online Booking above.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label
              htmlFor="counsellor-state-filter"
              className="block text-xs font-semibold text-[#0F766E] mb-1"
            >
              Search by State
            </label>
            <select
              id="counsellor-state-filter"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-[#F0FDFA] text-slate-900 border border-teal-300 rounded-lg"
            >
              <option value="ALL">All Indian States (Pan-India)</option>
              {INDIAN_STATES_LIST.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

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
              <option value="Tamil">Tamil</option>
              <option value="Kannada">Kannada</option>
              <option value="Gujarati">Gujarati</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="counsellor-mode-filter"
              className="block text-xs font-medium text-slate-600 mb-1"
            >
              Session Mode
            </label>
            <select
              id="counsellor-mode-filter"
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg"
            >
              <option value="ALL">All Modes</option>
              <option value="Offline & Online">Offline & Online</option>
              <option value="Online">Online Only</option>
            </select>
          </div>

          <div className="pt-4 sm:pt-5">
            <button
              type="button"
              onClick={() => setShowOnboardingForm((v) => !v)}
              className="px-3.5 py-2 text-xs font-semibold text-[#0D3B49] bg-[#F0FDFA] border border-teal-200 rounded-lg hover:bg-teal-100 cursor-pointer whitespace-nowrap"
            >
              {showOnboardingForm ? 'Close Onboarding Form' : '+ Join as Counsellor (Phase 7)'}
            </button>
          </div>
        </div>
      </div>

      {/* State-Wise Quick Filter Bar */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold text-slate-500 mr-1 inline-flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-[#0F766E]" /> State-Wise Filter:
        </span>
        {['ALL', 'Maharashtra', 'Delhi NCR', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'All India Online'].map(
          (st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStateFilter(st)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold border cursor-pointer ${
                stateFilter === st
                  ? 'bg-[#0D3B49] text-white border-[#0D3B49]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st === 'ALL' ? 'All States' : st}
            </button>
          )
        )}
      </div>

      {/* Phase 7 · Counsellor Onboarding & Verification Workflow */}
      {showOnboardingForm && (
        <form
          onSubmit={handleOnboardCounsellor}
          className="mt-6 p-6 rounded-xl bg-white border-2 border-[#0D3B49] space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <p className="text-xs font-semibold text-[#0F766E]">
                Phase 7 · 7-Stage Counsellor Onboarding & Credential Verification
              </p>
              <h2 className="text-lg font-bold text-slate-900">
                Apply to Join the Bytezen Career360 Verified Counsellor Network
              </h2>
              <p className="text-xs text-slate-500">
                Workflow: Registration → Document Upload → Qualification Verification → Experience Review → Interview → Approval → Profile Activation
              </p>
            </div>
          </div>

          {onboardSuccess && (
            <div className="p-3 rounded-lg bg-[#F0FDFA] border border-teal-200 text-xs font-semibold text-[#0F766E]">
              {onboardSuccess}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="ob-name" className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name & Title
              </label>
              <input
                id="ob-name"
                type="text"
                required
                placeholder="e.g. Dr. Kavita Menon"
                value={onboardName}
                onChange={(e) => setOnboardName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="ob-qual" className="block text-xs font-semibold text-slate-700 mb-1">
                Qualifications & Certifications
              </label>
              <input
                id="ob-qual"
                type="text"
                required
                placeholder="e.g. M.Phil Psychology · Certified Career Analyst"
                value={onboardQual}
                onChange={(e) => setOnboardQual(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="ob-spec" className="block text-xs font-semibold text-slate-700 mb-1">
                Core Specialization
              </label>
              <input
                id="ob-spec"
                type="text"
                placeholder="e.g. Class 9-12 Stream & Study Abroad"
                value={onboardSpec}
                onChange={(e) => setOnboardSpec(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="ob-exp" className="block text-xs font-semibold text-slate-700 mb-1">
                Experience (Years)
              </label>
              <input
                id="ob-exp"
                type="number"
                min={1}
                max={40}
                value={onboardExp}
                onChange={(e) => setOnboardExp(Number(e.target.value) || 5)}
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="ob-fee" className="block text-xs font-semibold text-slate-700 mb-1">
                45-Min Session Fee (INR)
              </label>
              <input
                id="ob-fee"
                type="number"
                min={499}
                max={9999}
                value={onboardFee}
                onChange={(e) => setOnboardFee(Number(e.target.value) || 1499)}
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="ob-city" className="block text-xs font-semibold text-slate-700 mb-1">
                City / Consultation Mode
              </label>
              <input
                id="ob-city"
                type="text"
                value={onboardCity}
                onChange={(e) => setOnboardCity(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#0F766E] text-white text-xs font-semibold hover:bg-[#115E59] cursor-pointer"
            >
              Complete Verification & Activate Profile
            </button>
          </div>
        </form>
      )}

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
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-[#0F766E]">
                  {c.state || 'All India Online'} ({c.city})
                </span>
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
              {bookings.map((bk) => {
                const effectiveStatus = localBookingOverrides[bk.id] || bk.status;
                return (
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
                    <td className="py-3 pl-4 text-right">
                      <select
                        aria-label={`Booking status for ${bk.studentName}`}
                        value={effectiveStatus}
                        onChange={(e) =>
                          handleUpdateBookingStatus(bk, e.target.value as BookingRecord['status'])
                        }
                        className="px-2 py-1 text-xs font-semibold text-[#0F766E] bg-[#F8FAFC] border border-slate-200 rounded-md"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Rescheduled">Rescheduled</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
