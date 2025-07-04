import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js'; // Make sure this exists
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user; // ✅ full user object
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
