import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Footer from '../../components/Footer';

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    content: string;
    cover_image: string | null;
    author: string;
    published_at: string;
}

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        loadPost();
    }, [slug]);

    const loadPost = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/blog/posts/${slug}`);
            if (!response.ok) {
                setError(true);
                return;
            }
            const data = await response.json();
            setPost(data.post);
        } catch (error) {
            console.error('Failed to load blog post:', error);
            setError(true);
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

    const getReadingTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.split(' ').length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min de lecture`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-linkedin-500"></div>
                    <p className="mt-4 text-gray-400">Chargement de l'article...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Article non trouvé</h1>
                    <Link to="/blog" className="text-linkedin-500 hover:underline">
                        Retour au blog
                    </Link>
                </div>
            </div>
        );
    }

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

            {/* Article */}
            <article className="container mx-auto px-4 py-16 max-w-4xl">
                {/* Back Link */}
                <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour au blog
                </Link>

                {/* Cover Image */}
                {post.cover_image && (
                    <div className="aspect-video rounded-2xl overflow-hidden mb-8">
                        <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Meta */}
                <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.published_at)}
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {getReadingTime(post.content)}
                    </div>
                    <span>{post.author}</span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                    {post.title}
                </h1>

                {/* Content */}
                <div className="prose prose-invert prose-lg max-w-none">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

                {/* CTA */}
                <div className="mt-16 p-8 glass rounded-2xl text-center">
                    <h3 className="text-2xl font-bold mb-4">Prêt à automatiser votre LinkedIn ?</h3>
                    <p className="text-gray-400 mb-6">
                        Rejoignez des centaines de professionnels qui utilisent Shaly pour développer leur présence sur LinkedIn.
                    </p>
                    <Link
                        to="/#pricing"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full gradient-primary hover:shadow-lg hover:shadow-linkedin-500/50 transition-all duration-300 font-semibold"
                    >
                        Essayer Gratuitement
                        <ArrowLeft className="w-5 h-5 rotate-180" />
                    </Link>
                </div>
            </article>

            <Footer />
        </div>
    );
}
