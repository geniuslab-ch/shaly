import { useState } from 'react';
import { X, Send, Calendar } from 'lucide-react';
import { apiService, Post } from '../services/api';

interface CreatePostModalProps {
    onClose: () => void;
    onPostCreated: (post: Post) => void;
}

export default function CreatePostModal({ onClose, onPostCreated }: CreatePostModalProps) {
    const [content, setContent] = useState('');
    const [scheduledFor, setScheduledFor] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!content.trim()) {
            setError('Content is required');
            return;
        }

        if (content.length > 3000) {
            setError('Content exceeds 3000 characters');
            return;
        }

        try {
            setLoading(true);

            let response;
            if (scheduledFor) {
                // Schedule for later
                const scheduledDate = new Date(scheduledFor);
                if (scheduledDate <= new Date()) {
                    setError('Scheduled time must be in the future');
                    setLoading(false);
                    return;
                }
                response = await apiService.schedulePost(content, scheduledFor);
            } else {
                // Publish now
                response = await apiService.publishNow(content);
            }

            onPostCreated(response.post);
        } catch (err: any) {
            console.error('Failed to create post:', err);
            setError(err.response?.data?.message || err.response?.data?.error || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 5); // Minimum 5 minutes from now
        return now.toISOString().slice(0, 16);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="glass rounded-2xl max-w-2xl w-full p-6 animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Create LinkedIn Post</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Content */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Post Content
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What do you want to share on LinkedIn?"
                            className="w-full h-40 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-linkedin-500 focus:outline-none focus:ring-2 focus:ring-linkedin-500/50 resize-none transition-all"
                            maxLength={3000}
                        />
                        <div className="flex items-center justify-between mt-2 text-sm">
                            <span className="text-gray-400">
                                {content.length} / 3000 characters
                            </span>
                            {content.length > 2900 && (
                                <span className="text-yellow-500">
                                    {3000 - content.length} characters remaining
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Schedule (Optional)
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="datetime-local"
                                value={scheduledFor}
                                onChange={(e) => setScheduledFor(e.target.value)}
                                min={getMinDateTime()}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-linkedin-500 focus:outline-none focus:ring-2 focus:ring-linkedin-500/50 transition-all"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            Leave empty to publish immediately
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-medium"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !content.trim()}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-primary hover:shadow-lg hover:shadow-linkedin-500/50 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    {scheduledFor ? 'Schedule Post' : 'Publish Now'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
