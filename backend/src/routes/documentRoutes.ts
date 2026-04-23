import { Router } from 'express';
import multer from 'multer';
import documentController from '../controllers/documentController';

const router = Router();

// Configure multer for file uploads (memory storage for processing)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP allowed.'));
    }
  },
});

// Routes
router.post('/verify', upload.single('document'), (req, res) => {
  documentController.verifyDocument(req, res);
});

router.get('/types', (req, res) => {
  documentController.getSupportedTypes(req, res);
});

export default router;
