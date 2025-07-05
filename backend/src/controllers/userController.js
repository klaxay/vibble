// src/controllers/userController.js
import prisma from '../prismaClient.js';

export const getContacts = async (req, res) => {
  const currentUserId = req.user.id;

  try {
    const users = await prisma.user.findMany({
      where: {
        id: { not: currentUserId },
      },
      select: {
        id: true,
        username: true,
        // email: true,
      },
    });

    res.json(users);
  } catch (err) {
    console.error('Failed to fetch contacts:', err);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};
