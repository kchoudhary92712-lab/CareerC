import { INITIAL_PLATFORM_DB, RBAC_PERMISSION_MATRIX } from '../../src/data/seedData';
import {
  fromSupabaseBookingRow,
  supabase,
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  SupabaseBookingRow,
  toSupabaseBookingRow,
  toSupabaseLeadRow,
  toSupabaseOrderRow,
} from '../../src/lib/supabase';

export const handler = async (event: {
  path: string;
  httpMethod: string;
  body?: string | null;
}) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const route = event.path.replace(/^\/\.netlify\/functions\/api/, '').replace(/^\/api/, '');
  const body = event.body ? JSON.parse(event.body) : {};

  try {
    if (route === '/bootstrap' || route === '/supabase/sync-bookings') {
      const db = structuredClone(INITIAL_PLATFORM_DB);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const remoteBookings = (data as SupabaseBookingRow[]).map(fromSupabaseBookingRow);
        const map = new Map(db.bookings.map((b) => [b.id, b]));
        for (const rb of remoteBookings) map.set(rb.id, rb);
        db.bookings = Array.from(map.values());
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          db,
          rbac: RBAC_PERMISSION_MATRIX,
          supabaseStatus: {
            projectId: SUPABASE_PROJECT_ID,
            url: SUPABASE_URL,
            tableReady: !error,
            syncedCount: db.bookings.length,
            message: error
              ? error.message
              : `Connected to Supabase (${SUPABASE_PROJECT_ID}). ${db.bookings.length} booking appointments synced.`,
          },
        }),
      };
    }

    if (route === '/bookings' && event.httpMethod === 'POST') {
      const counsellor =
        INITIAL_PLATFORM_DB.counsellors.find((c) => c.id === body.counsellorId) ||
        INITIAL_PLATFORM_DB.counsellors[0];
      const bookingId = `bk-${Date.now()}`;
      const newBooking = {
        id: bookingId,
        studentId: body.studentId || 'usr-student-1',
        studentName: body.studentName || 'Student',
        studentCohort: body.studentCohort || 'Class 11-12',
        counsellorId: counsellor.id,
        counsellorName: counsellor.name,
        serviceTitle: body.serviceTitle || '1-on-1 Career Counselling Session',
        date: body.date,
        slot: body.slot,
        mode: body.mode || 'Online Video',
        feePaidInr: counsellor.feeInr,
        status: 'Confirmed' as const,
        meetingLink: `https://meet.bytezenit.com/career360-${bookingId}`,
        notes: body.notes || '',
        createdAt: new Date().toISOString().slice(0, 10),
      };

      const { error } = await supabase
        .from('bookings')
        .upsert(toSupabaseBookingRow(newBooking), { onConflict: 'id' });

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          booking: newBooking,
          supabaseSynced: !error,
        }),
      };
    }

    if (route === '/leads' && event.httpMethod === 'POST') {
      const newLead = {
        id: `ld-${Date.now()}`,
        name: String(body.name || '').trim(),
        mobile: String(body.mobile || '').trim(),
        email: String(body.email || '').trim(),
        userType: body.userType || 'Student',
        studentClassOrRole: body.studentClassOrRole || 'Class 11-12',
        city: body.city || 'India',
        serviceInterested: body.serviceInterested || 'Career Guidance',
        preferredContact: body.preferredContact || 'WhatsApp',
        leadSource: body.leadSource || 'Website',
        leadOwner: 'Aditi Rao (Senior Career Advisor)',
        leadScore: 88,
        stage: 'New Lead' as const,
        notes: `Interested in ${body.serviceInterested}`,
        followUpDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        createdAt: new Date().toISOString().slice(0, 10),
      };

      await supabase.from('leads').upsert(toSupabaseLeadRow(newLead), { onConflict: 'id' });
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ lead: newLead }),
      };
    }

    if (route === '/orders/checkout' && event.httpMethod === 'POST') {
      const gross = Number(body.amountInr) || 999;
      const coupon = String(body.couponCode || '').trim().toUpperCase();
      const rate = coupon === 'FUTURE20' ? 0.2 : coupon === 'BYTEZEN10' ? 0.1 : 0;
      const discountInr = Math.round(gross * rate);
      const totalPaidInr = Math.max(0, gross - discountInr);
      const baseAmount = Math.round(totalPaidInr / 1.18);
      const newOrder = {
        id: `ord-${Date.now()}`,
        userId: body.userId || 'usr-student-1',
        userName: body.userName || 'Student',
        productType: body.productType || 'Report',
        productId: body.productId,
        productName: body.productName,
        amountInr: baseAmount,
        gstInr: totalPaidInr - baseAmount,
        discountInr,
        totalPaidInr,
        paymentMethod: body.paymentMethod || 'UPI',
        couponApplied: rate > 0 ? coupon : undefined,
        invoiceNumber: `BZ-C360-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Paid' as const,
        createdAt: new Date().toISOString().slice(0, 10),
      };

      await supabase.from('orders').upsert(toSupabaseOrderRow(newOrder), { onConflict: 'id' });
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ order: newOrder }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: 'ok', route }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err?.message || 'Serverless function error' }),
    };
  }
};
