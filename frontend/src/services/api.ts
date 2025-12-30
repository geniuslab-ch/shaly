import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface Post {
    id: number;
    user_id: number;
    content: string;
    media_urls?: string[];
    scheduled_for: string;
    status: 'pending' | 'published' | 'failed';
    linkedin_post_id?: string;
    error_message?: string;
    created_at?: string;
    published_at?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export const apiService = {
    // Auth
    async checkAuthStatus(): Promise<{ authenticated: boolean; user?: User }> {
        const response = await api.get('/auth/status');
        return response.data;
    },

    // Posts
    async publishNow(content: string): Promise<{ success: boolean; post: Post }> {
        const response = await api.post('/api/posts/publish-now', { content });
        return response.data;
    },

    async schedulePost(content: string, scheduledFor: string): Promise<{ success: boolean; post: Post }> {
        const response = await api.post('/api/posts/schedule', { content, scheduledFor });
        return response.data;
    },

    async getPosts(): Promise<{ posts: Post[] }> {
        const response = await api.get('/api/posts');
        return response.data;
    },

    async deletePost(id: number): Promise<{ success: boolean }> {
        const response = await api.delete(`/api/posts/${id}`);
        return response.data;
    },
};

export const getLinkedInAuthUrl = () => {
    return `${API_URL}/auth/linkedin`;
};
