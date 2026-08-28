import path from 'path';
import fs from 'fs';

export interface RSVPRecord {
  id: string;
  name: string;
  attending: 'yes' | 'no';
  guestCount: number;
  contact?: string;
  notes?: string;
  createdAt: string;
}

export interface GuestbookRecord {
  id: string;
  name: string;
  message: string;
  photoUrl?: string;
  status: 'pending' | 'approved' | 'hidden';
  createdAt: string;
}

export interface DatabaseSchema {
  rsvps: RSVPRecord[];
  guestbook: GuestbookRecord[];
}

const initialDb: DatabaseSchema = {
  rsvps: [],
  guestbook: [],
};

// In-memory cache for serverless warm execution
let memoryDb: DatabaseSchema | null = null;

// Determine writable DB file path
export function getDbFilePath(): string {
  // If explicitly in Vercel / Lambda environment, use /tmp
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join('/tmp', 'wedding_db.json');
  }

  try {
    const localDataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(localDataDir)) {
      fs.mkdirSync(localDataDir, { recursive: true });
    }
    // Test writability
    const testFile = path.join(localDataDir, '.write_test');
    fs.writeFileSync(testFile, '1', 'utf-8');
    fs.unlinkSync(testFile);
    return path.join(localDataDir, 'db.json');
  } catch {
    // If local directory is read-only, fallback to /tmp
    return path.join('/tmp', 'wedding_db.json');
  }
}

export function getUploadsDir(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpUploads = path.join('/tmp', 'uploads');
    if (!fs.existsSync(tmpUploads)) {
      fs.mkdirSync(tmpUploads, { recursive: true });
    }
    return tmpUploads;
  }

  try {
    const pubUploads = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(pubUploads)) {
      fs.mkdirSync(pubUploads, { recursive: true });
    }
    return pubUploads;
  } catch {
    const tmpUploads = path.join('/tmp', 'uploads');
    if (!fs.existsSync(tmpUploads)) {
      fs.mkdirSync(tmpUploads, { recursive: true });
    }
    return tmpUploads;
  }
}

export function readDb(): DatabaseSchema {
  if (memoryDb) {
    return memoryDb;
  }

  const filePath = getDbFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      memoryDb = JSON.parse(raw);
      return memoryDb!;
    }
    // Try reading seed db from project data/db.json if available
    const projectDbPath = path.join(process.cwd(), 'data', 'db.json');
    if (fs.existsSync(projectDbPath)) {
      const seedRaw = fs.readFileSync(projectDbPath, 'utf-8');
      const parsed = JSON.parse(seedRaw);
      memoryDb = parsed;
      writeDb(parsed);
      return parsed;
    }
  } catch (err) {
    console.error('Error reading DB file:', err);
  }

  memoryDb = { ...initialDb };
  return memoryDb;
}

export function writeDb(data: DatabaseSchema): void {
  memoryDb = data;
  const filePath = getDbFilePath();
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB file:', err);
  }
}
