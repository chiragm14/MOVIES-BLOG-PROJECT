import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/current-user
router.get('/current-user', auth, getCurrentUser);

export default router;
