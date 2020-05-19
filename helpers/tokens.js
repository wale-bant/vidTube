import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const createAccessToken = userId =>
  jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });

const createRefreshToken = userId =>
  jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });

const sendRefreshToken = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
};

const sendAccessToken = (res, userId, accessToken) =>
  res.send({ accessToken, userId });

export {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
};
