import { Clock, CheckCircle, XCircle, Trash2, Calendar } from 'lucide-react';
import { Post } from '../services/api';

interface PostCardProps {
    post: Post;
    onDelete: (postId: number) => void;
}

export default function PostCard({ post, onDelete }: PostCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const getStatusConfig = () => {
        switch (post.status) {
            case 'published':
                return {
                    icon: <CheckCircle className="w-4 h-4" />,
                    label: 'Published',
                    className: 'bg-green-500/20 text-green-400 border-green-500/50',
                };
            case 'failed':
                return {
                    icon: <XCircle className="w-4 h-4" />,
                    label: 'Failed',
                    className: 'bg-red-500/20 text-red-400 border-red-500/50',
                };
            default:
                return {
                    icon: <Clock className="w-4 h-4" />,
                    label: 'Pending',
                    className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
                };
        }
    };

    const statusConfig = getStatusConfig();
    const isPending = post.status === 'pending';
    const isScheduled = new Date(post.scheduled_for) > new Date();

    return (
        <div className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.className}`}
                >
                    {statusConfig.icon}
                    {statusConfig.label}
                </div>
                {isPending && (
                    <button
                        onClick={() => onDelete(post.id)}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        title="Delete post"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="mb-4">
                <p className="text-gray-300 line-clamp-4 leading-relaxed">
                    {post.content}
                </p>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 text-sm text-gray-400 border-t border-white/10 pt-4">
                <Calendar className="w-4 h-4" />
                {post.status === 'published' && post.published_at ? (
                    <span>Published {formatDate(post.published_at)}</span>
                ) : isScheduled ? (
                    <span>Scheduled for {formatDate(post.scheduled_for)}</span>
                ) : (
                    <span>Created {formatDate(post.created_at || post.scheduled_for)}</span>
                )}
            </div>

            {/* Error Message */}
            {post.status === 'failed' && post.error_message && (
                <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                    <strong>Error:</strong> {post.error_message}
                </div>
            )}
        </div>
    );
}
