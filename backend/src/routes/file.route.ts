import Router from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.ts';
import { uploadFile, processFile } from '../controllers/file.controller.ts';
import multer from 'multer';

const router = Router();

const upload = multer({ 
  dest: './uploads/',
  limits: {filesize: 2 * 1024 * 1024}, // 2MB

  filefilter: (req, file, cb) => {
    // Check MIME type
    const isCSV =
      file.mimetype === 'text/csv' ||
      file.mimetype === 'application/vnd.ms-excel'; // sometimes CSV comes like this

    // Extra safety: check extension
    const isCSVExt = file.originalname.toLowerCase().endsWith('.csv');

    if (isCSV && isCSVExt) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
})


router.get('/', authenticateToken, (req, res) => {
  res.send("Hello authenticated User!!")
})

router.post('/upload', authenticateToken, upload.single('file'), uploadFile)

router.post('/process', authenticateToken, upload.single('file'), processFile)

export default router;