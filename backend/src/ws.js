import {WebSocketServer} from 'ws';
import jwt from 'jsonwebtoken';
import prisma from './prismaClient.js'; // import your Prisma instance
import dotenv from 'dotenv';

dotenv.config();

const clients = new Map(); // Map<userId, WebSocket>

export const initWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('🔌 New WebSocket connection established');

    ws.on('message', async (rawData) => {
      let data;
      try {
        data = JSON.parse(rawData);
      } catch (err) {
        return ws.send(JSON.stringify({ error: 'Invalid JSON format' }));
      }

      // 1️⃣ Authenticate WebSocket via JWT
      if (data.type === 'auth') {
        try {
          const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
          const userId = decoded.id;
          ws.userId = userId;
          clients.set(userId, ws);
          console.log(`✅ WebSocket authenticated for user ${userId}`);

          // 2️⃣ Fetch unseen messages for user
          const unseenMessages = await prisma.message.findMany({
            where: {
              receiverId: userId,
              seen: false,
            },
            orderBy: {
              timestamp: 'asc',
            },
            include: {
              sender: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          });

          // 3️⃣ Send unseen messages
          unseenMessages.forEach((msg) => {
            ws.send(JSON.stringify({
              type: 'message',
              from: msg.sender.username,
              content: msg.content,
              timestamp: msg.timestamp,
              seen: false,
            }));
          });

          // 4️⃣ Mark them as seen in DB
          await prisma.message.updateMany({
            where: {
              receiverId: userId,
              seen: false,
            },
            data: {
              seen: true,
            },
          });

        } catch (err) {
          console.error('❌ WebSocket authentication failed');
          ws.close();
        }
        return;
      }

      // 5️⃣ Handle incoming messages
      if (data.type === 'message') {
        if (!ws.userId) {
          return ws.send(JSON.stringify({ error: 'Not authenticated' }));
        }

        const { to, content } = data;

        try {
          // Get receiver ID from username
          const receiver = await prisma.user.findUnique({
            where: { username: to },
          });

          if (!receiver) {
            return ws.send(JSON.stringify({ error: 'Receiver not found' }));
          }

          // Save message to DB (seen = true only if receiver is online)
          const isReceiverOnline = clients.has(receiver.id);

          const saved = await prisma.message.create({
            data: {
              content,
              senderId: ws.userId,
              receiverId: receiver.id,
              seen: isReceiverOnline,
            },
          });

          // If receiver is online, deliver it
          const receiverSocket = clients.get(receiver.id);
          if (receiverSocket) {
            receiverSocket.send(
              JSON.stringify({
                type: 'message',
                from: (await prisma.user.findUnique({
                  where: { id: ws.userId },
                  select: { username: true }
                })).username,
                content,
                timestamp: saved.timestamp,
                seen: true,
              })
            );
          }

          // Acknowledge sender
          ws.send(JSON.stringify({
            type: 'sent',
            to,
            content,
            timestamp: saved.timestamp,
            seen: isReceiverOnline,
          }));

        } catch (err) {
          console.error('❌ Failed to process message:', err);
          ws.send(JSON.stringify({ error: 'Message delivery failed' }));
        }
      }
    });

    // 6️⃣ Cleanup on socket close
    ws.on('close', () => {
      if (ws.userId) {
        clients.delete(ws.userId);
        console.log(`🔌 WebSocket closed for user ${ws.userId}`);
      }
    });
  });
};
