import { useState, useEffect } from 'react';
import { Plus, LogOut, RefreshCw } from 'lucide-react';
import { apiService, User, Post } from '../services/api';
import CreatePostModal from './CreatePostModal';
import PostCard from './PostCard';
import TrialBanner from './TrialBanner';
import PaymentRequiredModal from './PaymentRequiredModal';
import { useTrialStatus } from '../hooks/useTrialStatus';

interface DashboardProps {
    user: User;
    onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const { trialDaysRemaining, isExpired, loading: trialLoading } = useTrialStatus();

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setRefreshing(true);
            const response = await apiService.getPosts();
            setPosts(response.posts);
        } catch (error) {
            console.error('Failed to load posts:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handlePostCreated = (newPost: Post) => {
        setPosts([newPost, ...posts]);
        setShowCreateModal(false);
    };

    const handleDeletePost = async (postId: number) => {
        try {
            await apiService.deletePost(postId);
            setPosts(posts.filter(p => p.id !== postId));
        } catch (error) {
            console.error('Failed to delete post:', error);
            alert('Failed to delete post');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            {/* Header */}
            <header className="glass border-b border-white/10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="font-semibold">{user.name}</h2>
                                <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={loadPosts}
                                disabled={refreshing}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                                title="Refresh posts"
                            >
                                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                            </button>
                            <a
                                href="/settings/accounts"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                                title="Gérer les comptes"
                            >
                                ⚙️ Comptes
                            </a>
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Trial Banner */}
                {!trialLoading && trialDaysRemaining > 0 && trialDaysRemaining <= 14 && (
                    <TrialBanner daysLeft={trialDaysRemaining} />
                )}

                {/* Action Bar */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Your Posts</h1>
                        <p className="text-gray-400">
                            {posts.length} {posts.length === 1 ? 'post' : 'posts'} total
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-6 py-3 rounded-full gradient-primary hover:shadow-lg hover:shadow-linkedin-500/50 transition-all duration-300 hover:scale-105 font-semibold"
                    >
                        <Plus className="w-5 h-5" />
                        New Post
                    </button>
                </div>

                {/* Posts Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-linkedin-500"></div>
                        <p className="mt-4 text-gray-400">Loading posts...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full glass mb-6">
                            <Plus className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">No posts yet</h3>
                        <p className="text-gray-400 mb-6">Create your first LinkedIn post to get started</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-primary hover:shadow-lg hover:shadow-linkedin-500/50 transition-all duration-300 font-semibold"
                        >
                            <Plus className="w-5 h-5" />
                            Create Post
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onDelete={handleDeletePost}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Create Post Modal */}
            {showCreateModal && (
                <CreatePostModal
                    onClose={() => setShowCreateModal(false)}
                    onPostCreated={handlePostCreated}
                />
            )}

            {/* Payment Required Modal for expired trial */}
            {!trialLoading && isExpired && (
                <PaymentRequiredModal />
            )}
        </div>
    );
}
