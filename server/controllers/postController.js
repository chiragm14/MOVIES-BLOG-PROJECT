import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Post from '../models/Post.js';

import cloudinary from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

// Helper to delete an image file from Cloudinary or local uploads
const deleteImageFile = async (imageUrlOrFilename) => {
  if (!imageUrlOrFilename) return;

  // If it's a Cloudinary URL, destroy by public_id
  if (imageUrlOrFilename.includes('res.cloudinary.com')) {
    try {
      // Extract public ID from Cloudinary URL (e.g. movies-blog/12345-name)
      const matches = imageUrlOrFilename.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
      if (matches && matches[1]) {
        await cloudinary.uploader.destroy(matches[1]);
      }
    } catch (err) {
      console.error('Failed to delete Cloudinary image:', err.message);
    }
    return;
  }

  // Otherwise, handle local file deletion
  const filePath = path.join(uploadsDir, imageUrlOrFilename);
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error(`Failed to delete local image: ${filePath}`, err.message);
    }
  });
};

// Helper to get image path/url from multer file
const getImageUrl = (file) => {
  if (!file) return '';
  // Multer-storage-cloudinary provides file.path (full Cloudinary URL)
  return file.path || file.filename;
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  try {
    const { title, slug, content, status, rating } = req.body;

    // Validate required fields
    if (!title || !slug || !content) {
      // Clean up uploaded file if validation fails
      if (req.file) deleteImageFile(req.file.filename);
      return res.status(400).json({ message: 'Please provide title, slug, and content.' });
    }

    // Check if slug already exists
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      if (req.file) deleteImageFile(req.file.filename);
      return res.status(400).json({ message: 'A post with this slug already exists.' });
    }

    const post = await Post.create({
      title,
      slug,
      content,
      featuredImage: getImageUrl(req.file),
      status: status || 'active',
      rating: Number(rating) || 5,
      userId: req.user._id,
    });

    // Populate userId with name and email before returning
    const populatedPost = await Post.findById(post._id).populate('userId', 'name email');

    res.status(201).json(populatedPost);
  } catch (error) {
    if (req.file) deleteImageFile(req.file.filename);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A post with this slug already exists.' });
    }
    res.status(500).json({ message: 'Server error creating post.', error: error.message });
  }
};

// Helper to find a post by slug or _id
const findPostBySlugOrId = async (identifier) => {
  let post = await Post.findOne({ slug: identifier });
  if (!post && identifier.match(/^[0-9a-fA-F]{24}$/)) {
    post = await Post.findById(identifier);
  }
  return post;
};

// @desc    Update a post by slug or _id
// @route   PUT /api/posts/:slug
// @access  Private
export const updatePost = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, slug: newSlug, content, status, rating } = req.body;

    const post = await findPostBySlugOrId(slug);
    if (!post) {
      if (req.file) deleteImageFile(req.file.filename);
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Check author permissions
    if (post.userId.toString() !== req.user._id.toString()) {
      if (req.file) deleteImageFile(req.file.filename);
      return res.status(403).json({ message: 'Not authorized to update this post.' });
    }

    // Check if the new slug conflicts with another post
    if (newSlug && newSlug !== post.slug) {
      const slugConflict = await Post.findOne({ slug: newSlug });
      if (slugConflict && slugConflict._id.toString() !== post._id.toString()) {
        if (req.file) deleteImageFile(req.file.filename);
        return res.status(400).json({ message: 'A post with this slug already exists.' });
      }
    }

    // If a new image is uploaded, delete the old one
    if (req.file && post.featuredImage) {
      deleteImageFile(post.featuredImage);
    }

    // Update fields
    if (title !== undefined) post.title = title;
    if (newSlug !== undefined) post.slug = newSlug;
    if (content !== undefined) post.content = content;
    if (status !== undefined) post.status = status;
    if (rating !== undefined) post.rating = Number(rating);
    if (req.file) post.featuredImage = getImageUrl(req.file);

    await post.save();

    // Populate userId with name and email before returning
    const updatedPost = await Post.findById(post._id).populate('userId', 'name email');

    res.json(updatedPost);
  } catch (error) {
    if (req.file) deleteImageFile(req.file.filename);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A post with this slug already exists.' });
    }
    res.status(500).json({ message: 'Server error updating post.', error: error.message });
  }
};

// @desc    Delete a post by slug or _id
// @route   DELETE /api/posts/:slug
// @access  Private
export const deletePost = async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await findPostBySlugOrId(slug);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Check author permissions
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post.' });
    }

    // Delete the associated image file
    if (post.featuredImage) {
      deleteImageFile(post.featuredImage);
    }

    await Post.findByIdAndDelete(post._id);

    res.json({ message: 'Post deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting post.', error: error.message });
  }
};

// @desc    Get a single post by slug or _id
// @route   GET /api/posts/:slug
// @access  Public
export const getPost = async (req, res) => {
  try {
    const { slug } = req.params;

    let post = await Post.findOne({ slug }).populate('userId', 'name email');
    if (!post && slug.match(/^[0-9a-fA-F]{24}$/)) {
      post = await Post.findById(slug).populate('userId', 'name email');
    }

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching post.', error: error.message });
  }
};

// @desc    Get all posts (optionally filter by status)
// @route   GET /api/posts?status=active
// @access  Public
export const getPosts = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const posts = await Post.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching posts.', error: error.message });
  }
};
