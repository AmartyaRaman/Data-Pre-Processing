import Router from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.ts';
import { processFile } from '../controllers/file.controller.ts';
import multer from 'multer';

const router = Router();

const upload = multer({ dest: './uploads/'})


router.get('/', authenticateToken, (req, res) => {
  res.send("Hello authenticated User!!")
})

router.post('/upload', authenticateToken, upload.single('file'), processFile)

export default router;