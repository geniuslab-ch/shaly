import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Footer from '../../components/Footer';

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    cover_image: string | null;
    author: string;
    published_at: string;
    created_at: string;
}

export default function BlogList() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/blog/posts`);
            const data = await response.json();
            setPosts(data.posts);
        } catch (error) {
            console.error('Failed to load blog posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-CH', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getReadingTime = (excerpt: string) => {
        const wordsPerMinute = 200;
        const words = excerpt.split(' ').length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min de lecture`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            {/* Header */}
            <header className="glass border-b border-white/10">
                <div className="container mx-auto px-4 py-6">
                    <Link to="/" className="text-2xl font-bold gradient-text">
                        Shaly
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-16">
                {/* Page Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">Blog Shaly</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Conseils, astuces et stratégies pour optimiser votre présence LinkedIn
                    </p>
                </div>

                {/* Posts Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-linkedin-500"></div>
                        <p className="mt-4 text-gray-400">Chargement des articles...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-400">Aucun article publié pour le moment.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                to={`/blog/${post.slug}`}
                                className="group glass rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:transform hover:-translate-y-2"
                            >
                                {/* Cover Image */}
                                {post.cover_image ? (
                                    <div className="aspect-video overflow-hidden">
                                        <img
                                            src={post.cover_image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-gradient-to-br from-linkedin-500/20 to-blue-500/20 flex items-center justify-center">
                                        <span className="text-6xl">📝</span>
                                    </div>
                                )}

                                {/* Content */}
                                <div className="p-6">
                                    {/* Meta */}
                                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(post.published_at)}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {getReadingTime(post.excerpt)}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-xl font-bold mb-3 group-hover:text-linkedin-400 transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>

                                    {/* Excerpt */}
                                    <p className="text-gray-400 mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    {/* Author & Read More */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">{post.author}</span>
                                        <div className="flex items-center gap-2 text-linkedin-500 font-semibold group-hover:gap-3 transition-all">
                                            Lire l'article
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
