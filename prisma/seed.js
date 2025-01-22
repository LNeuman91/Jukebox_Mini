const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.user.createMany({
        data: [
            { name: 'Alice', email: 'alice@example.com' },
            { name: 'Bob', email: 'bob@example.com' },
            { name: 'Charlie', email: 'charlie@example.com' },
        ],
    });

    const users = await prisma.user.findMany();

    for (const user of users) {
        await prisma.playlist.createMany({
            data: [
                { title: 'Rock Classics', userId: user.id },
                { title: 'Jazz Vibes', userId: user.id },
                { title: 'Workout Mix', userId: user.id },
                { title: 'Chill Lo-Fi', userId: user.id },
                { title: 'Top Hits', userId: user.id },
            ],
        });
    }
}

main()
    .then(() => console.log('Database seeded successfully'))
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
