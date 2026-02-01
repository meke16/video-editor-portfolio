// Vercel serverless function for /api/portfolio
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const items = await prisma.portfolioItem.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(items);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { title, description, youtubeUrl, featured } = JSON.parse(body);
        const newItem = await prisma.portfolioItem.create({
          data: { title, description, youtubeUrl, featured }
        });
        res.status(201).json(newItem);
      } catch (err) {
        res.status(500).json({ error: 'Failed to create portfolio item' });
      }
    });
  } else {
    res.status(405).send('Method Not Allowed');
  }
};