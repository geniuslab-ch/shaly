import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
axiosInstance.interceptors.request.use((config) => {
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
    organization_id?: string;
    publish_as?: 'person' | 'organization';
}

export const api = {
    /**
     * Login with LinkedIn
     */
    loginWithLinkedIn: () => {
        window.location.href = `${API_URL}/auth/linkedin`;
    },

    /**
     * Handle OAuth callback
     */
    handleCallback: async (code: string) => {
        const response = await axiosInstance.get(`/auth/linkedin/callback?code=${code}`);
        return response.data;
    },

    /**
     * Get user's posts
     */
    getPosts: async (): Promise<Post[]> => {
        const response = await axiosInstance.get('/api/posts');
        return response.data;
    },

    /**
     * Delete a post
     */
    deletePost: async (postId: number) => {
        await axiosInstance.delete(`/api/posts/${postId}`);
    },

    /**
     * Create a new post
     */
    createPost: async (postData: Omit<Post, 'id' | 'status'>) => {
        const response = await axiosInstance.post('/api/posts', postData);
        return response.data;
    },

    /**
     * Get organizations (pages) the user can administer
     */
    getOrganizations: async () => {
        const response = await axiosInstance.get('/api/organizations');
        return response.data;
    },
};
