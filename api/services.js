// Vercel serverless function for /api/services
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const services = await prisma.service.findMany();
      res.status(200).json(services);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch services' });
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
};