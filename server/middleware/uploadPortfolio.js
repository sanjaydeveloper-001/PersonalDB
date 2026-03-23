import multer from 'multer';

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const valid = allowed.test(file.originalname.toLowerCase().split('.').pop()) && allowed.test(file.mimetype);
  valid ? cb(null, true) : cb(new Error('Only images are allowed (jpeg, jpg, png, gif, webp)'));
};

export const uploadPortfolio = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});
