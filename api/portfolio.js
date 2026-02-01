// Vercel serverless function for /api/portfolio using vanilla Node.js and PostgreSQL
const client = require('./db');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const result = await client.query('SELECT * FROM "portfolioItem" ORDER BY "createdAt" DESC');
      res.status(200).json(result.rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { title, description, youtubeUrl, featured } = JSON.parse(body);
        const result = await client.query(
          'INSERT INTO "portfolioItem" (title, description, "youtubeUrl", featured) VALUES ($1, $2, $3, $4) RETURNING *',
          [title, description, youtubeUrl, featured]
        );
        res.status(201).json(result.rows[0]);
      } catch (err) {
        res.status(500).json({ error: 'Failed to create portfolio item' });
      }
    });
  } else {
    res.status(405).send('Method Not Allowed');
  }
};