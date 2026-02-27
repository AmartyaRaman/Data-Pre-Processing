import Router from 'express';

import { login, logout, register } from '../controllers/auth.controller.ts'

const router = Router();

router.get('/', (req, res) => {
  res.send('Auth routes/');
});

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)

export default router;
