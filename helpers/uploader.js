/* eslint-disable camelcase */
import { dataUri } from '../middleware/multer';
import cloudinary from '../config/cloudinary';

const uploader = async (req, res) => {
  if (!req.file) return res.send('No file selected');

  try {
    const { content } = await dataUri(req);
    const result = await cloudinary.uploader.upload(content, {
      folder: 'my_tube',
      resource_type: 'video',
      quality: 55,
    });
    return { url: result.secure_url };
  } catch (error) {
    res.status(400).json({
      messge: 'Someting went wrong while processing your request',
      error: error.message,
    });
  }
};

export default uploader;
