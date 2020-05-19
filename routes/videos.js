import express from 'express';
import cld from 'cloudinary';
import multer from 'multer';
import isAuth from '../helpers/isAuth.js';
import Video from '../models/Video.js';
import { videoSchema } from '../helpers/validateInput.js';

// set filetype
const fileFilter = (_req, file, cb) => {
  // Check ext
  const extname = file.originalname.toLowerCase().endsWith('mp4');
  // Check mime
  const mimetype = file.mimetype.endsWith('mp4');

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb('Error: Only MP4 Videos are allowed!');
};
const upload = multer({ dest: 'uploads/', fileFilter });

// cloudinary config
const cloudinary = cld.v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const router = express.Router();

router.post('/videos', upload.single('video'), async (req, res) => {
  // console.log(req.body);
  const { originalname, path, destination, size } = req.file;

  // "fieldname": "video",
  //   "originalname": "5YZd44qB1NEY5Bzl.mp4",
  //   "encoding": "7bit",
  //   "mimetype": "video/mp4",
  //   "destination": "uploads/",
  //   "filename": "6ad64cddae2d0d8691dff94944cb8e9c",
  //   "path": "uploads/6ad64cddae2d0d8691dff94944cb8e9c",
  //   "size": 10382025

  return cloudinary.uploader.upload(
    originalname,
    {
      resource_type: 'video',
      public_id: `${destination}/${originalname}`,
      chunk_size: 6000000,
      eager: [
        { width: 300, height: 300, crop: 'pad', audio_codec: 'none' },
        {
          width: 160,
          height: 100,
          crop: 'crop',
          gravity: 'south',
          audio_codec: 'none',
        },
      ],
      eager_async: true,
      eager_notification_url: path,
    },
    function(error, result) {
      console.log(result, error);
      return res.send({ result, error });
    }
  );

  // return res.send(req.file);
  const { error } = videoSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { title, description, url } = req.body;
  console.log(req.user);

  //   create video
  const video = new Video({
    title,
    description,
    url,
    likes: 0,
    dislikes: 0,
    comments: [],
    userId: req.user._id,
  });

  try {
    const savedVideo = await video.save();
    res.status(201).send(savedVideo);
  } catch (error) {
    res.send({ error: error.message });
  }
});

router.get('/videos', async (req, res) => {
  console.log(req.method);

  try {
    const videos = await Video.find();
    res.send(videos);
  } catch (error) {
    res.send({ error: error.message });
  }
});

export default router;
