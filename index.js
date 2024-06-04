import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import groupRoutes from './routes/group.route.js';
import projectRoutes from './routes/project.route.js';

import cookieParser from 'cookie-parser';
import connectToMongoDB from "./utils/connectDB.js";
dotenv.config();

const app = express();

 
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({ extended: true ,limit: '1mb' }));
app.use(cookieParser());
app.use(cors({
    origin: "*",
    methods : ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Routes Configuration....
app.use('/api/v4/user', userRoutes);
app.use('/api/v4/auth', authRoutes);
app.use('/api/v4/group', groupRoutes);
app.use('/api/v4/project', projectRoutes);



// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
});

app.get('/', (req, res) => {
    res.send("Working");
});

const PORT = process.env.PORT || 8000;

connectToMongoDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to the database', error);
        process.exit(1);  // Exit the process if database connection fails
    });
