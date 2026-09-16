const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const fs = require('fs');

// Set up storage configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  },
});

// File validation
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif|mp4|mov/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images and Videos only!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

module.exports = upload;
