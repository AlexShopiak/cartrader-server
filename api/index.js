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

//Pinging stopped because of unexpected DB trottling in osl. Resume in case of current DB disuse in the osl
//setInterval(pingMyself, 5*60*1000);

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.post('/api/visitor', async (req, res) => {
  try {
    const ipAddress = req.body.ipAddress;
    console.log('IP Address:', ipAddress);
    const newIp = new Visitor({ ipAddress });
    await newIp.save();
    res.send({ success: true });
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).send({ success: false, error: error.message });
  }
});

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
