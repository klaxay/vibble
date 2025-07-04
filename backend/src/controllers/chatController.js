import prisma from '../prismaClient.js';

/**
 * GET /api/messages/:username
 * Fetch all messages between the authenticated user and :username
 */
export const getChatHistory = async (req, res) => {
  const myId = req.user.id;
  const otherUsername = req.params.username;

  try {
    const otherUser = await prisma.user.findUnique({
      where: { username: otherUsername }
    });

    if (!otherUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: myId, receiverId: otherUser.id },
          { senderId: otherUser.id, receiverId: myId }
        ]
      },
      orderBy: {
        timestamp: 'asc'
      }
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.error('getChatHistory error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * GET /api/chats
 * Fetch chat list of the authenticated user (distinct users they’ve chatted with)
 */
export const getChatList = async (req, res) => {
  const myId = req.user.id;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: myId },
          { receiverId: myId }
        ]
      },
      orderBy: { timestamp: 'desc' },
      include: {
        sender: { select: { id: true, username: true } },
        receiver: { select: { id: true, username: true } }
      }
    });

    const chatMap = new Map();

    messages.forEach(msg => {
      const otherUser = msg.senderId === myId ? msg.receiver : msg.sender;

      if (!chatMap.has(otherUser.id)) {
        chatMap.set(otherUser.id, {
          username: otherUser.username,
          lastMessage: msg.content,
          timestamp: msg.timestamp,
          seen: msg.receiverId === myId ? msg.seen : true,
        });
      }
    });

    return res.status(200).json([...chatMap.values()]);
  } catch (error) {
    console.error('getChatList error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * PATCH /api/messages/mark-seen
 * Mark messages from a particular user as seen
 * Request body: { "fromUser": "username" }
 */
export const markMessagesAsSeen = async (req, res) => {
  const myId = req.user.id;
  const { fromUser } = req.body;

  try {
    const sender = await prisma.user.findUnique({
      where: { username: fromUser }
    });

    if (!sender) {
      return res.status(404).json({ error: 'Sender not found' });
    }

    const updated = await prisma.message.updateMany({
      where: {
        senderId: sender.id,
        receiverId: myId,
        seen: false
      },
      data: {
        seen: true
      }
    });

    return res.status(200).json({ success: true, updated: updated.count });
  } catch (error) {
    console.error('markMessagesAsSeen error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * GET /api/users/search?query=
 * Search users by username substring (case-insensitive)
 */
export const searchUsers = async (req, res) => {
  const searchQuery = req.query.query || '';

  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: searchQuery,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        username: true
      }
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('searchUsers error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
