import { useState } from 'react';
import { X, Send, Calendar, FileText, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { apiService, Post } from '../services/api';
import { OrganizationSelector } from './OrganizationSelector';
import MediaUploader from './MediaUploader';

interface CreatePostModalProps {
    onClose: () => void;
    onPostCreated: (post: Post) => void;
}

type PostType = 'text' | 'image' | 'article';

export default function CreatePostModal({ onClose, onPostCreated }: CreatePostModalProps) {
    const [postType, setPostType] = useState<PostType>('text');
    const [content, setContent] = useState('');
    const [scheduledFor, setScheduledFor] = useState('');
    const [selectedOrganization, setSelectedOrganization] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Media state
    const [mediaUrls, setMediaUrls] = useState<string[]>([]);
    const [articleUrl, setArticleUrl] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!content.trim()) {
            setError('Le contenu est requis');
            return;
        }

        if (content.length > 3000) {
            setError('Le contenu dépasse 3000 caractères');
            return;
        }

        if (postType === 'image' && mediaUrls.length === 0) {
            setError('Veuillez ajouter au moins une image');
            return;
        }

        if (postType === 'article' && !articleUrl.trim()) {
            setError('Veuillez entrer une URL d\'article');
            return;
        }

        try {
            setLoading(true);

            let response;
            if (scheduledFor) {
                const scheduledDate = new Date(scheduledFor);
                if (scheduledDate <= new Date()) {
                    setError('La date de programmation doit être dans le futur');
                    setLoading(false);
                    return;
                }
                response = await apiService.schedulePost(
                    content,
                    scheduledFor,
                    selectedOrganization,
                    postType === 'image' ? mediaUrls : undefined,
                    postType,
                    postType === 'article' ? articleUrl : undefined
                );
            } else {
                response = await apiService.publishNow(
                    content,
                    selectedOrganization,
                    mediaUrls.length > 0 ? mediaUrls : undefined,
                    postType,
                    articleUrl || undefined
                );
            }

            onPostCreated(response.post);
            onClose();
        } catch (error: any) {
            console.error('Error creating post:', error);
            setError(error.response?.data?.error || 'Erreur lors de la création du post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-2xl font-bold text-white">Créer un post</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Post Type Tabs */}
                    <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setPostType('text')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${postType === 'text'
                                ? 'bg-linkedin-500 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <FileText className="w-4 h-4" />
                            Texte
                        </button>
                        <button
                            type="button"
                            onClick={() => setPostType('image')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${postType === 'image'
                                ? 'bg-linkedin-500 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <ImageIcon className="w-4 h-4" />
                            Image
                        </button>
                        <button
                            type="button"
                            onClick={() => setPostType('article')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${postType === 'article'
                                ? 'bg-linkedin-500 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <LinkIcon className="w-4 h-4" />
                            Article
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Content Textarea */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Contenu du post *
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Que voulez-vous partager ?"
                            rows={6}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-linkedin-500 focus:ring-2 focus:ring-linkedin-500/20 resize-none"
                            maxLength={3000}
                        />
                        <div className="mt-2 text-sm text-gray-400 text-right">
                            {content.length}/3000 caractères
                        </div>
                    </div>

                    {/* Article URL */}
                    {postType === 'article' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                URL de l'article *
                            </label>
                            <input
                                type="url"
                                value={articleUrl}
                                onChange={(e) => setArticleUrl(e.target.value)}
                                placeholder="https://example.com/mon-article"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-linkedin-500 focus:ring-2 focus:ring-linkedin-500/20"
                            />
                        </div>
                    )}

                    {/* Media Uploader */}
                    {postType === 'image' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Images (max 9)
                            </label>
                            <MediaUploader
                                onMediaChange={(media) => setMediaUrls(media.map(m => m.url))}
                                maxFiles={9}
                                acceptVideo={false}
                            />
                        </div>
                    )}

                    {/* Organization Selector */}
                    <OrganizationSelector
                        selectedOrganization={selectedOrganization}
                        onSelect={setSelectedOrganization}
                    />

                    {/* Schedule Date/Time */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Programmer (optionnel)
                        </label>
                        <input
                            type="datetime-local"
                            value={scheduledFor}
                            onChange={(e) => setScheduledFor(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-linkedin-500 focus:ring-2 focus:ring-linkedin-500/20"
                        />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl border border-white/20 hover:bg-white/5 transition-all font-semibold"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-primary hover:shadow-xl transition-all font-semibold disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Publication...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    {scheduledFor ? 'Programmer' : 'Publier'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
