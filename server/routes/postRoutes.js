import express from 'express';
import {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getPosts,
} from '../controllers/postController.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// GET /api/posts - Get all posts (public)
router.get('/', getPosts);

// GET /api/posts/:slug - Get single post (public)
router.get('/:slug', getPost);

// POST /api/posts - Create post (protected, with image upload)
router.post('/', auth, upload.single('image'), createPost);

// PUT /api/posts/:slug - Update post (protected, with image upload)
router.put('/:slug', auth, upload.single('image'), updatePost);

// DELETE /api/posts/:slug - Delete post (protected)
router.delete('/:slug', auth, deletePost);

export default router;
