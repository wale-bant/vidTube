import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  avatar: {
    type: String,
    required: false,
  },
  channelName: {
    type: String,
    min: 3,
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

export default mongoose.model('User', UserSchema);
