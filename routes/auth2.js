import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import isAuth from '../helpers/isAuth.js';
import User from '../models/User.js';
import { registerSchema, loginSchema } from '../helpers/validateInput.js';
import {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} from '../helpers/tokens.js';

const router = express.Router();

// register
router.post('/register', async (req, res) => {
  // validate user input with registerSchema
  const { error } = registerSchema.validate(req.body);
  const { avatar, channelName, username, password } = req.body;
  if (error) return res.status(400).send(error.details[0].message);

  //   check if username already exist
  const userExist = await User.findOne({ username });
  if (userExist)
    return res.status(400).send({ message: 'Username not available!' });

  //   hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    // create user
    const newUser = new User({
      avatar,
      username,
      channelName,
      password: hashedPassword,
    });

    // save user
    await newUser.save(async (err, user) => {
      // create and assign token
      const accessToken = createAccessToken(user._id);
      const refreshToken = createRefreshToken(user._id);
      if (err) return res.status(400).send({ err: err.message });

      // update refreshToken
      user.refreshToken = refreshToken;
      await user.save();
      // send tokens - refreshToken as cookie
      // && accessToken as regular response
      sendRefreshToken(res, refreshToken);
      sendAccessToken(res, user._id, accessToken);
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// login
router.post('/login', async (req, res) => {
  // validate user data with validation schema
  const { error } = loginSchema.validate(req.body);
  const { username, password } = req.body;

  if (error) return res.status(400).send(error.details[0].message);

  //
  await User.findOne({ username }, async (_err, user) => {
    // check if user exist
    if (!user)
      return res.status(400).send({ message: 'Invalid username or password!' });

    // validate password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.send({ message: 'Invalid username or **password!' });

    try {
      // create and assign token
      const accessToken = createAccessToken(user._id);
      const refreshToken = createRefreshToken(user._id);

      // store refreshToken in the DB
      user.refreshToken = refreshToken;
      const updatedUser = await user.save();
      // send tokens - refreshToken as cookie
      // && accessToken as regular response
      sendRefreshToken(res, refreshToken);
      sendAccessToken(res, updatedUser._id, accessToken);
    } catch (error) {
      return res.send({ error: error.message });
    }
  });
});

// logout
router.post('/logout', async (_req, res) => {
  res.clearCookie('refreshToken', { path: '/' });
  return res.send({ message: 'Logged out' });
});

// delete user
router.delete('/:id', isAuth, async (req, res) => {
  const { id } = req.params;
  const userId = await req.user;

  // check if _id === id
  if (id !== userId) return res.status(401).send('Unauthorized Access!');

  // check if user is in db
  try {
    const user = await User.findByIdAndDelete(userId);
    if (user) res.clearCookie('refreshToken', { path: '/' });
    res.send({ message: 'Account deleted successfully' });
  } catch (error) {
    res.send({ error: error.message });
  }
});

// get user information
router.get('/:id', isAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user;

  // check if _id === id
  if (id !== userId)
    return res.status(401).send({ message: 'Unauthorized Access!' });

  // check if user is in db
  try {
    const user = await User.findById(userId);
    res.send(user);
  } catch (error) {
    res.send({ error: error.message });
  }
});

//  get a new access token with a refresh token
router.post('/refresh_token', async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.send({ accessToken: '' });

  // we have token, let;s verify it
  let payload = null;
  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    res.send({ accessToken: '' });
  }

  await User.findById(payload.userId, async (err, user) => {
    // check if user exist
    if (!user || err) return res.send({ accessToken: '' });
    // check if refresh token exist on user
    if (user.refreshToken !== token) return res.send({ accessToken: '' });
    // create new refresh and access token
    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    try {
      // update refresh token
      user.refreshToken = refreshToken;
      await user.save();
      sendRefreshToken(res, refreshToken);
      res.send({ accessToken });
    } catch (error) {
      return res.send({ accessToken: '' });
    }
  });
});

export default router;
