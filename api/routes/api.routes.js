const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

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

// Admin Operations
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

// Admin: Get Messages
router.get('/messages', async (req, res) => {
    try {
        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

router.delete('/messages/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.contactMessage.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

// Hero Section
router.get('/hero', async (req, res) => {
    try {
        const hero = await prisma.heroSection.findFirst();
        res.json(hero || { title: 'Video Editor | YouTube Growth', subtitle: 'Specializing in high-retention editing', imageUrl: 'https://images.unsplash.com/photo-1574717432729-846c2415d9a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch hero section' });
    }
});

router.post('/hero', async (req, res) => {
    const { title, subtitle, imageUrl } = req.body;
    try {
        const first = await prisma.heroSection.findFirst();
        if (first) {
            const updated = await prisma.heroSection.update({
                where: { id: first.id },
                data: { title, subtitle, imageUrl }
            });
            res.json(updated);
        } else {
            const created = await prisma.heroSection.create({
                data: { title, subtitle, imageUrl }
            });
            res.json(created);
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to update hero section' });
    }
});

// Social Links
router.get('/socials', async (req, res) => {
    try {
        const socials = await prisma.socialLink.findMany();
        res.json(socials);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch social links' });
    }
});

router.post('/socials', async (req, res) => {
    const { platform, url } = req.body;
    try {
        const newSocial = await prisma.socialLink.create({
            data: { platform, url }
        });
        res.json(newSocial);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add social link' });
    }
});

router.delete('/socials/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.socialLink.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete social link' });
    }
});

module.exports = router;
