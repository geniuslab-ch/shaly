import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { apiService, User } from './services/api';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token in URL (OAuth callback)
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');

        if (token) {
            localStorage.setItem('token', token);
            window.history.replaceState({}, document.title, '/dashboard');
            checkAuth();
        } else if (error) {
            console.error('OAuth error:', error);
            setLoading(false);
        } else {
            checkAuth();
        }
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await apiService.checkAuthStatus();
            if (response.authenticated && response.user) {
                setIsAuthenticated(true);
                setUser(response.user);
            } else {
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-linkedin-500"></div>
                    <p className="mt-4 text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={
                    isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
                } />

                {/* Protected routes */}
                <Route path="/dashboard" element={
                    isAuthenticated && user ?
                        <Dashboard user={user} onLogout={handleLogout} /> :
                        <Navigate to="/login" />
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
