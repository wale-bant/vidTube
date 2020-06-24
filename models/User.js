import mongoose from 'mongoose';

const User = new mongoose.Schema({
  avatar: {
    type: String,
    required: false,
    default: '',
  },
  channelName: {
    type: String,
    default: '',
    max: 20,
  },
  username: {
    type: String,
    required: true,
    min: 6,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  refreshToken: {
    type: String,
    strict: false,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('User', User);
