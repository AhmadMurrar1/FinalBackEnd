import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import gameRoutes from './routes/gameRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const allowedOrigins = ['http://localhost:5173', 'https://gamerentfinal.netlify.app/','gamerentfinal.netlify.app/'];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};
dotenv.config();
const server = express();
server.use(express.json());
server.use(cors(corsOptions));
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
