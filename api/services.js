// Vercel serverless function for /api/services using vanilla Node.js and PostgreSQL
const client = require('./db');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const result = await client.query('SELECT * FROM "service"');
      res.status(200).json(result.rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch services' });
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
};