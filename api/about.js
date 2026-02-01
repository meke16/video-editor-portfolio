// Vercel serverless function for /api/about using vanilla Node.js and PostgreSQL
const client = require('./db');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const result = await client.query('SELECT * FROM "aboutSection" LIMIT 1');
      res.status(200).json(result.rows[0] || { content: '' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch about section' });
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
};