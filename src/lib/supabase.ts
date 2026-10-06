import { createClient } from '@supabase/supabase-js';
import { BookingRecord, LeadRecord, OrderRecord } from '../types/platform';

export const SUPABASE_PROJECT_ID = 'xvnijylejrfrhdrezyek';
export const SUPABASE_URL = 'https://xvnijylejrfrhdrezyek.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_yHfjsOXr5H37KygE-vA-5A_gObbvBJZ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false,
  },
});

export interface SupabaseBookingRow {
  id: string;
  student_id: string;
  student_name: string;
  student_cohort: string;
  counsellor_id: string;
  counsellor_name: string;
  service_title: string;
  appointment_date: string;
  time_slot: string;
  mode: string;
  fee_paid_inr: number;
  status: string;
  meeting_link: string;
  notes: string;
  created_at: string;
}

export function toSupabaseBookingRow(booking: BookingRecord): SupabaseBookingRow {
  return {
    id: booking.id,
    student_id: booking.studentId,
    student_name: booking.studentName,
    student_cohort: booking.studentCohort,
    counsellor_id: booking.counsellorId,
    counsellor_name: booking.counsellorName,
    service_title: booking.serviceTitle,
    appointment_date: booking.date,
    time_slot: booking.slot,
    mode: booking.mode,
    fee_paid_inr: booking.feePaidInr,
    status: booking.status,
    meeting_link: booking.meetingLink,
    notes: booking.notes || '',
    created_at: booking.createdAt,
  };
}

export function fromSupabaseBookingRow(row: SupabaseBookingRow): BookingRecord {
  return {
    id: row.id,
    studentId: row.student_id || 'usr-student-1',
    studentName: row.student_name,
    studentCohort: row.student_cohort || 'Class 11-12',
    counsellorId: row.counsellor_id || 'cns-meera',
    counsellorName: row.counsellor_name,
    serviceTitle: row.service_title,
    date: row.appointment_date,
    slot: row.time_slot,
    mode: (row.mode === 'In-Centre' ? 'In-Centre' : 'Online Video') as 'Online Video' | 'In-Centre',
    feePaidInr: Number(row.fee_paid_inr) || 1499,
    status: (row.status as BookingRecord['status']) || 'Confirmed',
    meetingLink: row.meeting_link || '',
    notes: row.notes || '',
    createdAt: row.created_at || new Date().toISOString().slice(0, 10),
  };
}

export function toSupabaseLeadRow(lead: LeadRecord) {
  return {
    id: lead.id,
    name: lead.name,
    mobile: lead.mobile,
    email: lead.email,
    user_type: lead.userType,
    student_class_or_role: lead.studentClassOrRole,
    city: lead.city,
    service_interested: lead.serviceInterested,
    preferred_contact: lead.preferredContact,
    lead_source: lead.leadSource,
    lead_owner: lead.leadOwner,
    lead_score: lead.leadScore,
    stage: lead.stage,
    notes: lead.notes,
    follow_up_date: lead.followUpDate,
    created_at: lead.createdAt,
  };
}

export function toSupabaseOrderRow(order: OrderRecord) {
  return {
    id: order.id,
    user_id: order.userId,
    user_name: order.userName,
    product_type: order.productType,
    product_id: order.productId,
    product_name: order.productName,
    amount_inr: order.amountInr,
    gst_inr: order.gstInr,
    discount_inr: order.discountInr,
    total_paid_inr: order.totalPaidInr,
    payment_method: order.paymentMethod,
    coupon_applied: order.couponApplied || null,
    invoice_number: order.invoiceNumber,
    status: order.status,
    created_at: order.createdAt,
  };
}

export const SUPABASE_SETUP_SQL = `-- Run this once in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/xvnijylejrfrhdrezyek/sql/new

-- 1. Appointment Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_cohort TEXT NOT NULL,
  counsellor_id TEXT NOT NULL,
  counsellor_name TEXT NOT NULL,
  service_title TEXT NOT NULL,
  appointment_date TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'Online Video',
  fee_paid_inr INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Confirmed',
  meeting_link TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  inserted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Leads & CRM Table
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  user_type TEXT NOT NULL,
  student_class_or_role TEXT,
  city TEXT,
  service_interested TEXT,
  preferred_contact TEXT,
  lead_source TEXT,
  lead_owner TEXT,
  lead_score INTEGER DEFAULT 85,
  stage TEXT DEFAULT 'New Lead',
  notes TEXT,
  follow_up_date TEXT,
  created_at TEXT NOT NULL,
  inserted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders & Payments Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  product_type TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  amount_inr INTEGER NOT NULL,
  gst_inr INTEGER NOT NULL,
  discount_inr INTEGER DEFAULT 0,
  total_paid_inr INTEGER NOT NULL,
  payment_method TEXT NOT NULL,
  coupon_applied TEXT,
  invoice_number TEXT NOT NULL,
  status TEXT DEFAULT 'Paid',
  created_at TEXT NOT NULL,
  inserted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Allow Publishable Key Read/Write
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read_write bookings" ON public.bookings;
CREATE POLICY "Allow public read_write bookings" ON public.bookings
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read_write leads" ON public.leads;
CREATE POLICY "Allow public read_write leads" ON public.leads
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read_write orders" ON public.orders;
CREATE POLICY "Allow public read_write orders" ON public.orders
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);`;
