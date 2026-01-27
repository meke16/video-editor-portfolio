const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.adminUser.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // In a real app we'd sign a JWT here. 
        // For this simple app, we just return success and frontend stores a flag.
        res.json({ message: 'Login successful', email: user.email });
    } catch (err) {
        res.status(500).json({ error: 'Login error' });
    }
});

module.exports = router;
