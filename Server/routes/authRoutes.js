import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { registerValidation, loginValidation } from '../middleware/validators.js';

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/logout', logout);
router.get('/me', protect, getMe);

export default router;
