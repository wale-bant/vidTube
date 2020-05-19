import multer from 'multer';
import DatauriParser from 'datauri/parser';
import path from 'path';

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

const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single('video');

// eslint-disable-next-line prefer-destructuring
const parser = new DatauriParser();

const dataUri = async req => {
  const { originalname, buffer } = await req.file;
  const ext = path.extname(originalname).toString();
  return parser.format(ext, buffer);
};

export { multerUploads, dataUri };
