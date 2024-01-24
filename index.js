import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import gameRoutes from './routes/gameRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();
const server = express();
server.use(express.json());
server.use(cors({
    origin: ['http://localhost:5173','https://rentgamefinal.netlify.app/'], 
    credentials: true, 
  }));
server.use(cookieParser());

server.use('/api/games', gameRoutes);
server.use('/api/users',userRoutes);
server.use(errorHandler)

const PORT = process.env.PORT || 3001;

mongoose
    .connect(process.env.CONNECTION_URI)
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server listening on ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });
