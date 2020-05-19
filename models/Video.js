import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 10,
    max: 30,
  },
  description: {
    type: String,
    required: true,
    min: 10,
    max: 255,
  },
  url: {
    type: String,
    required: false,
  },
  likes: {
    type: Number,
    required: false,
  },
  dislikes: {
    type: Number,
    required: false,
  },
  comments: [
    {
      text: String,
      required: false,
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
});

export default mongoose.model('Video', VideoSchema);
