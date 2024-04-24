import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import {pingMyself} from './utils/ping.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import Visitor from './models/visitor.model.js';
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(cors({
  origin: 'https://cartrader.onrender.com',
  credentials: true
}));

app.use(express.json());

app.use(cookieParser());

setInterval(pingMyself, 5*60*1000);

app.use((req, res, next) => {
  const ip = req.ip;
  console.log('IP Address:', ip);
  const newIp = new Visitor({ ipAddress: ip });
  newIp.save(); // Сохраняем IP-адрес в базу данных
  next();
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
