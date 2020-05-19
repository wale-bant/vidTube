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
  res.status(201).send({ accessToken, userId });

// create and send tokens
const sendTokens = async (res, user, sendAccess) => {
  // create and assign tokens
  const accessToken = createAccessToken(user._id);
  const refreshToken = createRefreshToken(user._id);

  // save refreshToken
  user.refreshToken = refreshToken;
  await user.save();

  // send tokens
  sendRefreshToken(res, refreshToken);
  if (sendAccess) sendAccessToken(res, user._id, accessToken);
  return accessToken;
};

export { sendTokens };
