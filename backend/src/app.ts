import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRouter from './routes/user.route.ts';
import authRouter from './routes/auth.route.ts';
import fileRouter from './routes/file.route.ts';
import errorhandler from './middlewares/error.middleware.ts';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter)
app.use('/api/file', fileRouter)

app.get('/', (req, res) => {
    res.send('Welcome to Data Pre-Processing Project API Endpoint');
});

// Global error handler
app.use(errorhandler);

export default app;
