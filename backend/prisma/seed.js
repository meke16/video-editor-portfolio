const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    // Check if admin exists
    const count = await prisma.adminUser.count();
    if (count === 0) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.adminUser.create({
            data: {
                email: 'admin@example.com',
                password: hashedPassword
            }
        });
        console.log('Created Admin: admin@example.com / admin123');
    }

    // Seed sample services
    const servicesCount = await prisma.service.count();
    if (servicesCount === 0) {
        await Promise.all([
            prisma.service.create({ data: { title: 'YouTube Reaction Editing', description: 'Fast-paced editing with zoom cuts, sound effects, and engaging overlays.' } }),
            prisma.service.create({ data: { title: 'Short-Form Content', description: 'Optimized for TikTok, Reels, and Shorts with captions and retention-focused editing.' } }),
            prisma.service.create({ data: { title: 'Thumbnail Design', description: 'Click-worthy thumbnails to improve CTR.' } })
        ]);
        console.log('Seeded Services');
    }

    // Seed About
    const aboutCount = await prisma.aboutSection.count();
    if (aboutCount === 0) {
        await prisma.aboutSection.create({
            data: {
                content: "I am a professional video editor with 5+ years of experience helping YouTubers grow. I specialize in high-energy reaction videos and viral short-form clips."
            }
        });
        console.log('Seeded About Section');
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
