import type { APIRoute } from 'astro';
import { insertBooking, type BookingInput } from '../../lib/db';
import { notifyOwner } from '../../lib/notify';

export const prerender = false;

function clean(v: FormDataEntryValue | null, max = 500): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();

  // Honeypot — bots fill this hidden field; humans never see it.
  if (clean(form.get('company'))) {
    return redirect('/thank-you', 303);
  }

  const booking: BookingInput = {
    name: clean(form.get('name'), 120),
    phone: clean(form.get('phone'), 40),
    email: clean(form.get('email'), 160),
    vehicle: clean(form.get('vehicle'), 160),
    service: clean(form.get('service'), 80),
    preferred: clean(form.get('preferred'), 80),
    address: clean(form.get('address'), 240),
    notes: clean(form.get('notes'), 1000),
    consent: form.get('consent') === 'on' || form.get('consent') === 'true',
  };

  // Minimal validation. TCPA: consent required before we store/contact a phone.
  const errors: string[] = [];
  if (booking.name.length < 2) errors.push('name');
  if (booking.phone.replace(/\D/g, '').length < 10) errors.push('phone');
  if (!booking.consent) errors.push('consent');

  if (errors.length) {
    return new Response(
      JSON.stringify({ ok: false, errors }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Best-effort persistence + email. Neither is required for the booking to
  // succeed (the front-end also routes the request to WhatsApp), so failures
  // here (e.g. no DB on serverless) must not break the submission.
  let id: number | null = null;
  try {
    id = await insertBooking(booking);
  } catch (err) {
    console.error('Booking save skipped:', err);
  }
  try {
    await notifyOwner(booking, id ?? 0);
  } catch (err) {
    console.error('Booking email skipped:', err);
  }

  return redirect('/thank-you', 303);
};
