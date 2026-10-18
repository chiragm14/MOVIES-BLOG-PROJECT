import api from './api';

export class AuthService {
    async createAccount({ email, password, name }) {
        try {
            const response = await api.post('/auth/register', { name, email, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            return user;
        } catch (error) {
            throw error.response?.data?.message
                ? new Error(error.response.data.message)
                : error;
        }
    }

    async login({ email, password }) {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            return user;
        } catch (error) {
            throw error.response?.data?.message
                ? new Error(error.response.data.message)
                : error;
        }
    }

    async getCurrentUser() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;
            const response = await api.get('/auth/current-user');
            return response.data;
        } catch (error) {
            return null;
        }
    }

    async logout() {
        localStorage.removeItem('token');
    }
}

const authService = new AuthService();

export default authService;
