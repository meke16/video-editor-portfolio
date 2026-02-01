// Vercel serverless function for /api/login
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { email, password } = JSON.parse(body);
        const user = await prisma.adminUser.findUnique({ where: { email } });
        if (!user || user.password !== password) {
          res.status(401).json({ error: 'Invalid credentials' });
        } else {
          res.status(200).json({ message: 'Login successful', email: user.email });
        }
      } catch (err) {
        res.status(500).json({ error: 'Login error' });
      }
    });
  } else {
    res.status(405).send('Method Not Allowed');
  }
};