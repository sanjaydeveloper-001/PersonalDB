import multer from 'multer';

const fileFilter = (req, file, cb) => {
  // Allow PDF, DOC, DOCX files
  const allowed = /pdf|doc|docx/;
  const valid = allowed.test(file.originalname.toLowerCase().split('.').pop()) && 
                (file.mimetype === 'application/pdf' || 
                 file.mimetype === 'application/msword' ||
                 file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  valid ? cb(null, true) : cb(new Error('Only PDF and DOC files are allowed'));
};

export const uploadResume = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter,
});
