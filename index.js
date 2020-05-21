import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
// import routes
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.js';
import videoRouter from './routes/videos.js';
// import dashboard monitor
require('./analytics/sharpdash');

dotenv.config();
const { PORT, DB_CONNECT } = process.env;
const app = express();

// Connect to MongoDB Atlas
mongoose.connect(
  DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => {
    console.log('Connected to MongoDB 📖');
  }
);

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
//   })
// );

// Route middlewares
app.use('/api/user', userRouter);
app.use('/api', videoRouter);

// listen to port
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT} 🔥🚀`);
});
