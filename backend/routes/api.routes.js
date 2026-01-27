const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get Public Data
router.get('/portfolio', async (req, res) => {
    try {
        const items = await prisma.portfolioItem.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
});

router.get('/services', async (req, res) => {
    try {
        const services = await prisma.service.findMany();
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});

router.get('/about', async (req, res) => {
    try {
        const about = await prisma.aboutSection.findFirst();
        res.json(about || { content: '' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch about section' });
    }
});

// Admin Operations (No middleware for now as requested "Simple Admin Panel", but good to have rudimentary checks if needed. 
// For "No complex authentication", we will trust the frontend to guard these, or add a simple check later.)

// Modify Portfolio
router.post('/portfolio', async (req, res) => {
    const { title, description, youtubeUrl, featured } = req.body;
    try {
        const newItem = await prisma.portfolioItem.create({
            data: { title, description, youtubeUrl, featured }
        });
        res.json(newItem);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create item' });
    }
});

router.put('/portfolio/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, youtubeUrl, featured } = req.body;
    try {
        const updated = await prisma.portfolioItem.update({
            where: { id: parseInt(id) },
            data: { title, description, youtubeUrl, featured }
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update item' });
    }
});

router.delete('/portfolio/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.portfolioItem.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

// Modify Services
router.post('/services', async (req, res) => {
    const { title, description } = req.body;
    try {
        const newService = await prisma.service.create({
            data: { title, description }
        });
        res.json(newService);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create service' });
    }
});

router.delete('/services/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.service.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete service' });
    }
});

// Modify About
router.post('/about', async (req, res) => {
    const { content } = req.body;
    try {
        // Upsert to ensure only one about section
        const first = await prisma.aboutSection.findFirst();
        if (first) {
            const updated = await prisma.aboutSection.update({
                where: { id: first.id },
                data: { content }
            });
            res.json(updated);
        } else {
            const created = await prisma.aboutSection.create({
                data: { content }
            });
            res.json(created);
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to update about section' });
    }
});

// Contact Form
router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        const newMessage = await prisma.contactMessage.create({
            data: { name, email, message }
        });
        res.json(newMessage);
    } catch (err) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

module.exports = router;
