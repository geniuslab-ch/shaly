import { ArrowRight, Zap } from 'lucide-react';

export default function Hero() {
    const scrollToPricing = () => {
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-linkedin-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="container mx-auto px-4 py-20 relative z-10">
                {/* Header with Logo */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-3">
                        <img src="/shaly-logo.png" alt="Shaly Logo" className="w-12 h-12" />
                        <span className="text-2xl font-bold gradient-text">Shaly</span>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-8 animate-fade-in">
                        <Zap className="w-4 h-4 text-linkedin-500" />
                        <span className="text-sm font-medium">Automatisation LinkedIn Intelligente</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
                        Automatisez votre présence
                        <br />
                        <span className="gradient-text">LinkedIn</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto animate-slide-up delay-100">
                        Planifiez, publiez et gérez vos posts LinkedIn automatiquement.
                        Gagnez du temps, restez constant, développez votre audience.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-200">
                        <button
                            onClick={scrollToPricing}
                            className="group px-8 py-4 rounded-full gradient-primary hover:shadow-lg hover:shadow-linkedin-500/50 transition-all duration-300 hover:scale-105 font-semibold flex items-center gap-2"
                        >
                            Commencer Gratuitement
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <a
                            href="#features"
                            className="px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 transition-all duration-300 font-semibold"
                        >
                            Découvrir les fonctionnalités
                        </a>
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400 animate-fade-in delay-300">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>14 jours d'essai gratuit</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>Sans carte bancaire</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>Annulation à tout moment</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
                    <div className="w-1 h-3 rounded-full bg-white/40"></div>
                </div>
            </div>
        </section>
    );
}
