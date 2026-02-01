// Vercel serverless function for /api/about
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const about = await prisma.aboutSection.findFirst();
      res.status(200).json(about || { content: '' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch about section' });
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
};