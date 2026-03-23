import multer from 'multer';

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|pdf|docx|txt/;
  const valid = allowed.test(file.originalname.toLowerCase().split('.').pop()) && allowed.test(file.mimetype);
  valid ? cb(null, true) : cb(new Error('File type not allowed'));
};

export const uploadVault = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter,
});
