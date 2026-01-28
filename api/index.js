const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// 1. Setup the Database Connection Pool (Stateless-friendly)
const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASS,
  database: process.env.PG_NAME,
  port: process.env.PG_PORT || 5432,
  ssl: {
    rejectUnauthorized: false, // Required for Neon connection
  },
  // Serverless optimization:
  max: 1, // Keep connections low for serverless functions
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});

async function handler(req, res) {
// 1. Add CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // For production, use your actual domain
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2. Handle the Preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url.split('?')[0];
  const method = req.method;
  
  // Vercel automatically parses req.body for you in most cases, 
  // but if you are running raw Node, you might need:
  const body = req.body;
  

  try {
    // --- Auth ---
    if (method === 'POST' && url === '/login') {
      const { email, password } = body;
      const { rows } = await pool.query('SELECT * FROM "AdminUser" WHERE email = $1', [email]);
      const user = rows[0];

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      return res.json({ message: 'Login successful', email: user.email });
    }

    // --- Portfolio ---
    if (method === 'GET' && url === '/portfolio') {
      const { rows } = await pool.query('SELECT * FROM "PortfolioItem" ORDER BY "createdAt" DESC');
      return res.status(200).json(rows);
    }

    if (method === 'POST' && url === '/portfolio') {
      const { title, description, youtubeUrl, featured } = body;
      const { rows } = await pool.query(
        'INSERT INTO "PortfolioItem" (title, description, "youtubeUrl", featured, "createdAt") VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
        [title, description, youtubeUrl, featured || false]
      );
      return res.json(rows[0]);
    }

    if (method === 'PUT' && url.startsWith('/portfolio/')) {
      const id = url.split('/')[2];
      const { title, description, youtubeUrl, featured } = body;
      const { rows } = await pool.query(
        'UPDATE "PortfolioItem" SET title = $1, description = $2, "youtubeUrl" = $3, featured = $4 WHERE id = $5 RETURNING *',
        [title, description, youtubeUrl, featured, id]
      );
      return res.json(rows[0]);
    }

    if (method === 'DELETE' && url.startsWith('/portfolio/')) {
      const id = url.split('/')[2];
      await pool.query('DELETE FROM "PortfolioItem" WHERE id = $1', [id]);
      return res.json({ message: 'Deleted successfully' });
    }

    // --- About (Upsert Logic) ---
    if (method === 'GET' && url === '/about') {
      const { rows } = await pool.query('SELECT * FROM "AboutSection" LIMIT 1');
      return res.json(rows[0] || { content: '' });
    }

    if (method === 'POST' && url === '/about') {
      const { content } = body;
      // Raw SQL "UPSERT" (Insert or Update on conflict)
      // Assuming 'id' 1 is your singleton record
      const { rows } = await pool.query(
        'INSERT INTO "AboutSection" (id, content) VALUES (1, $1) ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content RETURNING *',
        [content]
      );
      return res.json(rows[0]);
    }

    // --- Contact ---
    if (method === 'POST' && url === '/contact') {
      const { name, email, message } = body;
      const { rows } = await pool.query(
        'INSERT INTO "ContactMessage" (name, email, message, "createdAt") VALUES ($1, $2, $3, NOW()) RETURNING *',
        [name, email, message]
      );
      return res.json(rows[0]);
    }

    if (method === 'GET' && url === '/messages') {
      const { rows } = await pool.query('SELECT * FROM "ContactMessage" ORDER BY "createdAt" DESC');
      return res.json(rows);
    }

    // --- Hero ---
    if (method === 'GET' && url === '/hero') {
      const { rows } = await pool.query('SELECT * FROM "HeroSection" LIMIT 1');
      return res.json(rows[0] || { title: 'Default Title', subtitle: 'Default Sub' });
    }

    // --- Socials ---
    if (method === 'GET' && url === '/socials') {
      const { rows } = await pool.query('SELECT * FROM "SocialLink"');
      return res.json(rows);
    }

    if (method === 'POST' && url === '/socials') {
      const { platform, url: socialUrl } = body;
      const { rows } = await pool.query(
        'INSERT INTO "SocialLink" (platform, url) VALUES ($1, $2) RETURNING *',
        [platform, socialUrl]
      );
      return res.json(rows[0]);
    }

    // 404 handler
    res.status(404).json({ error: 'Not found' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
}

module.exports = handler;