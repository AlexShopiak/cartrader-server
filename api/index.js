import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();

app.use(cors({
  origin: 'https://cartrader.onrender.com',
  credentials: true
}));

app.use(express.json());

app.use(cookieParser());

// GET-запрос каждые 5 минут по указанной ссылке
async function makeRequest() {
  try {
    const res = await axios.get('https://pinger1.onrender.com/');
    console.log('Запрос прошел успешно:', res.status);
    console.log('===============================');
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error.message);
  }
}
// Выполнение запроса каждые 10 cек 
setInterval(makeRequest, 10*1000);

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);


/*app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})*/

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
