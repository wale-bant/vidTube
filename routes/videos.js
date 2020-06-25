import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { multerUploads } from '../middleware/multer.js';
import uploader from '../helpers/uploader.js';
import Video from '../models/Video.js';
import { videoSchema } from '../helpers/validateInput.js';
import User from '../models/User.js';

const router = express.Router();

// post video
router.post('/videos', isAuth, multerUploads, async (req, res) => {
  const { error } = videoSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { title, description } = req.body;
  const { url } = await uploader(req, res);

  //   create video
  const video = new Video({
    title,
    description,
    url,
    upvotes: 0,
    downvotes: 0,
    comments: [],
    userId: req.userId,
  });

  try {
    const savedVideo = await video.save();
    return res.status(201).send(savedVideo);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// get all videos
router.get('/videos', async (_req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).send(videos);
  } catch (error) {
    res.satus(404).send({ error: error.message });
  }
});

// get a single video
router.get('/videos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id);
    res.status(200).send(video);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

// delete video
router.delete('/videos/:id', isAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const video = await Video.findById(id);
    if (video.userId !== req.userId)
      return res
        .status(401)
        .send('You are not authorized to perform this action');

    await Video.findByIdAndDelete(id);
    return res.status(200).send('Video deleted successfully');
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

// upvote a video
router.post('/videos/:id/upvote', async (req, res) => {
  const { id } = req.params;
  await Video.findById(id, async (err, vid) => {
    if (err) return res.status(404).send({ error: 'Video not found' });

    try {
      vid.upvotes += 1;
      vid.save();
      return res.status(200).send(vid);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
});

// downvote a video
router.post('/videos/:id/downvote', async (req, res) => {
  const { id } = req.params;
  await Video.findById(id, async (err, vid) => {
    if (err) return res.status(404).send({ error: 'Video not found' });

    try {
      vid.downvotes += 1;
      vid.save();
      return res.status(200).send(vid);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
});

// comment on a video
router.post('/videos/:id/comment', isAuth, async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  await Video.findById(id, async (err, vid) => {
    if (err) return res.status(404).send({ error: 'Video not found' });
    const user = await User.findById(req.userId);
    try {
      vid.comments = [
        ...vid.comments,
        {
          text,
          postedBy: {
            username: user.username,
            avatar: user.avatar,
          },
        },
      ];

      vid.save();
      return res.status(200).send('Comment saved!');
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
});

// views count
router.post('/videos/increment_views/:id', async (req, res) => {
  const { id } = req.params;
  await Video.findById(id, async (err, vid) => {
    if (err) return res.status(404).send({ error: 'Video not found' });

    try {
      vid.views += 1;
      vid.save();
      return res.status(200).send(vid);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
});

export default router;
