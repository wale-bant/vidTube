import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { multerUploads } from '../middleware/multer.js';
import uploader from '../helpers/uploader.js';
import Video from '../models/Video.js';
import { videoSchema } from '../helpers/validateInput.js';

const router = express.Router();

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

router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find();
    res.send(videos);
  } catch (error) {
    res.send({ error: error.message });
  }
});

export default router;
