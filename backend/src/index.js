import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';

import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js'; // ✅ Add chat/message routes
import userRoutes from './routes/userRoutes.js'
import { initWebSocketServer } from './ws.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// 🌐 Middleware
app.use(cors());
app.use(express.json());

// 🔗 Routes
app.use('/api/auth', authRoutes);
app.use('/api', chatRoutes); // ✅ Use other API routes here
app.use('/api/users', userRoutes)

// 🔌 WebSocket Server
initWebSocketServer(server);

app.get('/api/test', (req, res)=>{
  res.json({success:true})
})

// 🚀 Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Vibble Backend running on http://localhost:${PORT}`);
});
