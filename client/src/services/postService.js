import api from './api';
import conf from '../conf/conf';

export class PostService {
    async createPost({ title, slug, content, featuredImage, status, rating, userId }) {
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('slug', slug);
            formData.append('content', content);
            formData.append('status', status);
            if (rating) {
                formData.append('rating', rating);
            }
            if (featuredImage) {
                formData.append('image', featuredImage);
            }

            const response = await api.post('/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async updatePost(slug, { title, slug: newSlug, content, featuredImage, status, rating }) {
        try {
            const formData = new FormData();
            formData.append('title', title);
            if (newSlug) {
                formData.append('slug', newSlug);
            }
            formData.append('content', content);
            formData.append('status', status);
            if (rating) {
                formData.append('rating', rating);
            }
            // Only append image if it's a File object (new upload)
            if (featuredImage && featuredImage instanceof File) {
                formData.append('image', featuredImage);
            }

            const response = await api.put(`/posts/${slug}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async deletePost(slug) {
        try {
            await api.delete(`/posts/${slug}`);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async getPost(slug) {
        try {
            const response = await api.get(`/posts/${slug}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getPosts(status = 'active') {
        try {
            const url = status ? `/posts?status=${status}` : '/posts';
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    getFilePreview(featuredImage) {
        if (!featuredImage) return '';
        // If it's already a full URL (Cloudinary or external), return it as is
        if (featuredImage.startsWith('http://') || featuredImage.startsWith('https://')) {
            return featuredImage;
        }
        return `${conf.serverUrl}/uploads/${featuredImage}`;
    }
}

const postService = new PostService();

export default postService;
