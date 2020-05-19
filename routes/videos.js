import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { multerUploads } from '../middleware/multer.js';
import uploader from '../helpers/uploader.js';
import Video from '../models/Video.js';
import { videoSchema } from '../helpers/validateInput.js';

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
    likes: 0,
    dislikes: 0,
    comments: [],
    userId: req.userId,
  });

  try {
    const savedVideo = await video.save();
    res.status(201).send(savedVideo);
  } catch (error) {
    res.send({ error: error.message });
  }
});

// get all videos
router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find();
    res.send(videos);
  } catch (error) {
    res.send({ error: error.message });
  }
});

// get a single video
router.get('/videos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id);
    res.send(video);
  } catch (error) {
    res.send({ error: error.message });
  }
});

// delete video
router.delete('/videos/:id', isAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const video = await Video.findById(id);
    if (video.userId !== req.userId)
      return res.send('You are not authorized to perform this action');

    await Video.findByIdAndDelete(id);
    return res.send('Video deleted successfully');
  } catch (error) {
    res.send({ error: error.message });
  }
});

export default router;
