import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { authMiddleware, optionalAuthMiddleware, AuthRequest } from './middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;

// Configure rate limit middleware
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 1000, // Maximum 1000 requests per minute per IP address
});

// postgres connection
const connectionString = process.env.DATABASE_URL || '';

function maskConn(cs: string) {
    try {
        const u = new URL(cs);
        if (u.password) {
            u.password = '*****'
        }
        return u.toString()
    } catch {
        return cs.replace(/:(?:[^@]+)@/, ':*****@')
    }
}

// Basic validation to surface helpful error when password is missing or invalid.
if (!connectionString) {
    console.warn('WARNING: DATABASE_URL not set. Pool will attempt to use other PG_* env vars.');
} else {
    try {
        const parsed = new URL(connectionString);
        if (!parsed.username || parsed.username.length === 0) {
            console.warn('DATABASE_URL has no username. Ensure it is in the format postgres://user:pass@host:port/db');
        }
        if (parsed.password === '') {
            console.warn('DATABASE_URL contains an empty password. That may cause authentication errors.');
        }
    } catch (err) {
        console.warn('Could not parse DATABASE_URL; please check format.');
    }
}

const pool = new Pool({
    connectionString,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err: unknown) => {
    console.error('Unexpected Postgres pool error', err);
});

console.log('Postgres pool configured:', connectionString ? maskConn(connectionString) : '(no connection string)');

// Configure Express server
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(limiter);

// Static file serving for uploaded images
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    try { fs.mkdirSync(uploadsDir, { recursive: true }); } catch { /* ignore */ }
}
app.use('/uploads', express.static(uploadsDir));

// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '');
        cb(null, `${Date.now()}-${Math.random().toString(36).slice(2,8)}-${base}${ext}`);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 8 * 1024 * 1024, files: 10 }, // 8MB per file, up to 10 files
    fileFilter: (_req, file, cb) => {
        const ok = /^(image\/(jpeg|png|gif|webp|avif))$/.test(file.mimetype);
        if (ok) return cb(null as any, true);
        return cb(new Error('Only image files are allowed') as any, false);
    }
});

// Basic health endpoint
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

// ---- Authentication API ----

// Signup endpoint
app.post('/auth/signup', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email, created_at',
      [firstName, lastName, email, passwordHash]
    );

    const user = result.rows[0];

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Login endpoint
app.post('/auth/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const result = await pool.query(
      'SELECT id, first_name, last_name, email, password_hash, created_at FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user (protected route)
app.get('/auth/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, first_name, last_name, email, created_at FROM users WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// ---- Profiles & Posts API ----

// Create profile (protected - one per user)
app.post('/profiles', authMiddleware, async (req: AuthRequest, res: Response) => {
    const {
        name,
        university,
        city,
        country,
        term,
        budget,
        currency,
        language,
        summary,
        rating,
    } = req.body;

    if (!name || !university || !term) {
        return res.status(400).json({ error: 'name, university and term are required' });
    }

    try {
        // Check if user already has a profile
        const existingProfile = await pool.query(
            'SELECT id FROM profiles WHERE user_id = $1',
            [req.userId]
        );

        if (existingProfile.rows.length > 0) {
            return res.status(400).json({ 
                error: 'You already have a profile. Please edit your existing profile instead.',
                profileId: existingProfile.rows[0].id
            });
        }

        const result = await pool.query(
            `INSERT INTO profiles (user_id, name, university, city, country, term, budget, currency, language, summary, rating)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [req.userId, name, university, city || null, country || null, term, budget || null, currency || null, language || null, summary || null, rating || null]
        );
        return res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Insert profile error', err);
        const msg = String(err ?? '');
        if (msg.includes('client password must be a string') || msg.includes('SASL: SCRAM-SERVER-FIRST-MESSAGE')) {
            return res.status(500).json({ error: 'Database authentication error', details: 'Postgres client reported an authentication error (client password must be a string). Check your DATABASE_URL and ensure the password is present and is a string: postgres://user:password@host:port/db' });
        }
        return res.status(500).json({ error: 'Insert failed', details: msg });
    }
});

// Get current user's profile
app.get('/profiles/me', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT * FROM profiles WHERE user_id = $1',
            [req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No profile found' });
        }

        return res.json(result.rows[0]);
    } catch (err) {
        console.error('Get user profile error', err);
        return res.status(500).json({ error: 'Failed to get profile' });
    }
});

// Update current user's profile
app.put('/profiles/me', authMiddleware, async (req: AuthRequest, res: Response) => {
    const {
        name,
        university,
        city,
        country,
        term,
        budget,
        currency,
        language,
        summary,
        rating,
    } = req.body;

    try {
        // Check if user has a profile
        const existingProfile = await pool.query(
            'SELECT id FROM profiles WHERE user_id = $1',
            [req.userId]
        );

        if (existingProfile.rows.length === 0) {
            return res.status(404).json({ error: 'No profile found to update' });
        }

        const result = await pool.query(
            `UPDATE profiles 
             SET name = $1, university = $2, city = $3, country = $4, term = $5, 
                 budget = $6, currency = $7, language = $8, summary = $9, rating = $10
             WHERE user_id = $11
             RETURNING *`,
            [name, university, city, country, term, budget, currency, language, summary, rating, req.userId]
        );

        return res.json(result.rows[0]);
    } catch (err) {
        console.error('Update profile error', err);
        return res.status(500).json({ error: 'Failed to update profile' });
    }
});

// List profiles with filters
app.get('/profiles', async (req: Request, res: Response) => {
    const { university, city, term, language, min_budget, max_budget, limit = '25', offset = '0' } = req.query as any;
    const where: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (university) { where.push(`university ILIKE $${idx++}`); params.push(`%${university}%`); }
    if (city) { where.push(`city ILIKE $${idx++}`); params.push(`%${city}%`); }
    if (term) { where.push(`term = $${idx++}`); params.push(term); }
    if (language) { where.push(`language ILIKE $${idx++}`); params.push(`%${language}%`); }
    if (min_budget) { where.push(`budget >= $${idx++}`); params.push(Number(min_budget)); }
    if (max_budget) { where.push(`budget <= $${idx++}`); params.push(Number(max_budget)); }

    const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const q = `SELECT * FROM profiles ${whereSQL} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(Number(limit));
    params.push(Number(offset));

    try {
        const result = await pool.query(q, params);
        return res.json({ count: result.rowCount, rows: result.rows });
    } catch (err) {
        console.error('List profiles error', err);
        return res.status(500).json({ error: 'Query failed', details: String(err) });
    }
});

// Get profile by id (with posts)
app.get('/profiles/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'invalid id' });
    try {
        const p = await pool.query('SELECT * FROM profiles WHERE id = $1', [id]);
        if (!p.rowCount) return res.status(404).json({ error: 'not found' });
        const posts = await pool.query('SELECT * FROM posts WHERE profile_id = $1 ORDER BY created_at DESC', [id]);
    type PostRow = { id: number; [key: string]: any };
    const postRows = posts.rows as PostRow[];
    const postIds = postRows.map((r: PostRow) => r.id);
        let imagesByPost: Record<number, any[]> = {};
        if (postIds.length) {
            const imgs = await pool.query('SELECT id, post_id, url, created_at FROM post_images WHERE post_id = ANY($1::int[]) ORDER BY created_at ASC', [postIds]);
            for (const img of imgs.rows) {
                if (!imagesByPost[img.post_id]) imagesByPost[img.post_id] = [];
                imagesByPost[img.post_id].push(img);
            }
        }
        const postsWithImages = postRows.map((r: PostRow) => ({ ...r, images: imagesByPost[r.id] || [] }));
        return res.json({ profile: p.rows[0], posts: postsWithImages });
    } catch (err) {
        console.error('Get profile error', err);
        return res.status(500).json({ error: 'Query failed', details: String(err) });
    }
});

// Update profile (partial)
app.patch('/profiles/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'invalid id' });
    const allowed = ['name','university','city','country','term','budget','currency','language','summary','rating'];
    const pairs: string[] = [];
    const params: any[] = [];
    let idx = 1;
    for (const k of allowed) {
        if (k in req.body) { pairs.push(`${k} = $${idx++}`); params.push((req.body as any)[k]); }
    }
    if (!pairs.length) return res.status(400).json({ error: 'no updatable fields' });
    params.push(id);
    const q = `UPDATE profiles SET ${pairs.join(', ')} WHERE id = $${idx} RETURNING *`;
    try {
        const r = await pool.query(q, params);
        return res.json(r.rows[0]);
    } catch (err) {
        console.error('Update profile error', err);
        return res.status(500).json({ error: 'Update failed', details: String(err) });
    }
});

// Create a post for a profile
// Create post (protected - only profile owner can post)
app.post('/profiles/:id/posts', authMiddleware, async (req: AuthRequest, res: Response) => {
    const profile_id = Number(req.params.id);
    const { title, body } = req.body;
    if (!profile_id || !title || !body) return res.status(400).json({ error: 'profile, title and body required' });
    
    try {
        // Verify the profile belongs to the authenticated user
        const profileCheck = await pool.query('SELECT id FROM profiles WHERE id = $1 AND user_id = $2', [profile_id, req.userId]);
        if (profileCheck.rows.length === 0) {
            return res.status(403).json({ error: 'You can only add posts to your own profile' });
        }

        const r = await pool.query('INSERT INTO posts (profile_id, title, body) VALUES ($1,$2,$3) RETURNING *', [profile_id, title, body]);
        return res.status(201).json(r.rows[0]);
    } catch (err) {
        console.error('Insert post error', err);
        return res.status(500).json({ error: 'Insert post failed', details: String(err) });
    }
});

// Upload images to a post (protected). Field name: 'images'
app.post('/posts/:id/images', authMiddleware, upload.array('images', 10), async (req: AuthRequest, res: Response) => {
    try {
        const postId = Number(req.params.id);
        if (!postId) return res.status(400).json({ error: 'invalid post id' });
        // Verify ownership via join posts -> profiles
        const own = await pool.query(
            `SELECT p.id FROM posts po JOIN profiles p ON p.id = po.profile_id WHERE po.id = $1 AND p.user_id = $2`,
            [postId, req.userId]
        );
        if (!own.rowCount) return res.status(403).json({ error: 'You can only upload images to your own post' });

        const files = (req as any).files as Express.Multer.File[] | undefined;
        if (!files || !files.length) return res.status(400).json({ error: 'No images uploaded' });

        const inserted: any[] = [];
        for (const f of files) {
            // Public URL under /uploads
            const relPath = `/uploads/${path.basename(f.path)}`;
            const r = await pool.query(
                'INSERT INTO post_images (post_id, url) VALUES ($1,$2) RETURNING id, post_id, url, created_at',
                [postId, relPath]
            );
            inserted.push(r.rows[0]);
        }
        return res.status(201).json({ images: inserted });
    } catch (err) {
        console.error('Upload images error', err);
        return res.status(500).json({ error: 'Upload failed', details: String(err) });
    }
});

// List posts (optionally filter by university/city/term via join)
app.get('/posts', async (req: Request, res: Response) => {
    const { university, city, term, limit = '25', offset = '0' } = req.query as any;
    const where: string[] = [];
    const params: any[] = [];
    let idx = 1;
    if (university) { where.push(`p.university ILIKE $${idx++}`); params.push(`%${university}%`); }
    if (city) { where.push(`p.city ILIKE $${idx++}`); params.push(`%${city}%`); }
    if (term) { where.push(`p.term = $${idx++}`); params.push(term); }
    const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const q = `SELECT posts.*, p.university, p.city, p.term FROM posts JOIN profiles p ON p.id = posts.profile_id ${whereSQL} ORDER BY posts.created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(Number(limit)); params.push(Number(offset));
    try {
        const r = await pool.query(q, params);
        return res.json({ count: r.rowCount, rows: r.rows });
    } catch (err) {
        console.error('List posts error', err);
        return res.status(500).json({ error: 'Query failed', details: String(err) });
    }
});


// Simple DB test endpoint - returns server time from Postgres
app.get('/db-time', async (_req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        return res.json({ dbTime: result.rows[0].now });
    } catch (err) {
        console.error('DB error', err);
        return res.status(500).json({ error: 'Database error', details: String(err) });
    }
});

// Start server
const server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received: closing server');
    server.close(async () => {
        await pool.end();
        process.exit(0);
    });
});

process.on('SIGINT', async () => {
    console.log('SIGINT received: closing server');
    server.close(async () => {
        await pool.end();
        process.exit(0);
    });
});