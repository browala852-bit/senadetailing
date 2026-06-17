// Local SQLite store for booking requests — uses Node's built-in SQLite
// (node:sqlite, Node 22+). No native compilation, no external service.
//
// Best-effort by design: on a persistent Node host the file ./data/bookings.db
// is created and bookings + /admin work fully. On serverless hosts (Vercel) the
// filesystem is read-only/ephemeral, so getDb() fails gracefully and every
// function here becomes a no-op — bookings are still delivered via WhatsApp/email.

let db: any = null;
let tried = false;

async function getDb(): Promise<any> {
  if (tried) return db;
  tried = true;
  try {
    const { DatabaseSync } = await import('node:sqlite');
    const { mkdirSync } = await import('node:fs');
    const { join } = await import('node:path');
    const dir = join(process.cwd(), 'data');
    mkdirSync(dir, { recursive: true });
    const handle = new DatabaseSync(join(dir, 'bookings.db'));
    handle.exec('PRAGMA journal_mode = WAL;');
    handle.exec(`
      CREATE TABLE IF NOT EXISTS bookings (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at  TEXT NOT NULL,
        name        TEXT NOT NULL,
        phone       TEXT NOT NULL,
        email       TEXT,
        vehicle     TEXT,
        service     TEXT,
        preferred   TEXT,
        address     TEXT,
        notes       TEXT,
        consent     INTEGER NOT NULL DEFAULT 0,
        status      TEXT NOT NULL DEFAULT 'new'
      );
    `);
    db = handle;
  } catch {
    // SQLite unavailable on this host (e.g. serverless) — disable persistence.
    db = null;
  }
  return db;
}

/** True when a persistent local DB is available (i.e. not serverless). */
export async function dbAvailable(): Promise<boolean> {
  return (await getDb()) !== null;
}

export interface BookingInput {
  name: string;
  phone: string;
  email?: string;
  vehicle?: string;
  service?: string;
  preferred?: string;
  address?: string;
  notes?: string;
  consent: boolean;
}

export interface BookingRow extends BookingInput {
  id: number;
  created_at: string;
  status: string;
}

/** Returns the new row id, or null if persistence is unavailable. */
export async function insertBooking(b: BookingInput): Promise<number | null> {
  const d = await getDb();
  if (!d) return null;
  const stmt = d.prepare(`
    INSERT INTO bookings
      (created_at, name, phone, email, vehicle, service, preferred, address, notes, consent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    new Date().toISOString(),
    b.name,
    b.phone,
    b.email ?? null,
    b.vehicle ?? null,
    b.service ?? null,
    b.preferred ?? null,
    b.address ?? null,
    b.notes ?? null,
    b.consent ? 1 : 0
  );
  return Number(info.lastInsertRowid);
}

export async function getBookings(): Promise<BookingRow[]> {
  const d = await getDb();
  if (!d) return [];
  return d.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all() as BookingRow[];
}

export async function updateBookingStatus(id: number, status: string): Promise<void> {
  const d = await getDb();
  if (!d) return;
  d.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, id);
}
