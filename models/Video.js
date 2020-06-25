import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 5,
    max: 30,
  },
  description: {
    type: String,
    required: true,
    min: 5,
    max: 255,
  },
  url: {
    type: String,
    required: false,
  },
  upvotes: {
    type: Number,
    required: false,
  },
  downvotes: {
    type: Number,
    required: false,
  },
  comments: [
    {
      text: String,
      postedBy: {
        username: String,
        avatar: String,
      },
    },
  ],
  userId: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model('Video', VideoSchema);
