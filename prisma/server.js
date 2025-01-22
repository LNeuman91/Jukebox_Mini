const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;

// GET all users
app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// GET user by ID (including playlists)
app.get('/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { playlists: true },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// POST create new playlist for user
app.post('/users/:id/playlists', async (req, res) => {
    const userId = parseInt(req.params.id);
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    try {
        const newPlaylist = await prisma.playlist.create({
            data: {
                title,
                userId,
            },
        });
        res.status(201).json(newPlaylist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create playlist' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
