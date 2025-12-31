import { Calendar, Clock, Zap, Shield, Linkedin, Sparkles } from 'lucide-react';
import { getLinkedInAuthUrl } from '../services/api';

export default function Login() {
    const handleLogin = () => {
        window.location.href = getLinkedInAuthUrl();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-[500px] h-[500px] bg-linkedin-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
                <div className="absolute w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl -bottom-64 -right-64 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
                {/* Hero Section */}
                <div className="text-center mb-12 animate-fade-in max-w-4xl">
                    {/* Logo */}
                    <div className="inline-flex items-center justify-center mb-8">
                        <img src="/shaly-logo.png" alt="Shaly Logo" className="h-32 w-auto drop-shadow-2xl" />
                    </div>

                    {/* Heading */}
                    <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                        <span className="bg-gradient-to-r from-white via-linkedin-400 to-white bg-clip-text text-transparent">
                            Automatisez votre
                        </span>
                        <br />
                        <span className="gradient-text">présence LinkedIn</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2x mx-auto leading-relaxed">
                        Programmez vos posts, gagnez du temps,
                        <br />
                        développez votre influence professionnelle
                    </p>

                    {/* CTA Button */}
                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={handleLogin}
                            className="group relative inline-flex items-center gap-3 px-10 py-5 text-lg font-bold rounded-2xl gradient-primary hover:shadow-2xl hover:shadow-linkedin-500/50 transition-all duration-300 hover:scale-105 animate-bounce-slow"
                        >
                            <Linkedin className="w-7 h-7" />
                            Se connecter avec LinkedIn
                            <Sparkles className="w-5 h-5 animate-pulse" />
                            <span className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
                        </button>

                        <p className="text-sm text-gray-400">
                            ✨ Essai gratuit 14 jours • Aucune carte bancaire requise
                        </p>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-16 w-full">
                    <FeatureCard
                        icon={<Zap className="w-8 h-8" />}
                        title="Publication Instantanée"
                        description="Publiez immédiatement sur votre profil LinkedIn en un clic"
                        delay="0"
                    />
                    <FeatureCard
                        icon={<Calendar className="w-8 h-8" />}
                        title="Planification Intelligente"
                        description="Programmez vos posts aux moments optimaux pour maximiser l'engagement"
                        delay="100"
                    />
                    <FeatureCard
                        icon={<Clock className="w-8 h-8" />}
                        title="Automatisation"
                        description="Configurez une fois, publiez automatiquement selon votre calendrier"
                        delay="200"
                    />
                    <FeatureCard
                        icon={<Shield className="w-8 h-8" />}
                        title="Sécurité OAuth"
                        description="Intégration officielle LinkedIn avec sécurité de niveau entreprise"
                        delay="300"
                    />
                </div>

                {/* Stats Section */}
                <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto text-center w-full">
                    <StatCard number="100%" label="Fiable" />
                    <StatCard number="24/7" label="Automatisé" />
                    <StatCard number="∞" label="Posts" />
                </div>

                {/* Trust Badge */}
                <div className="mt-12 text-center">
                    <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                        <Shield className="w-4 h-4" />
                        Propulsé par l'API LinkedIn v2 • Authentification OAuth 2.0 Sécurisée
                    </p>
                </div>
            </div>
        </div>
    );
}

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay: string;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
    return (
        <div
            className="glass rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-linkedin-500/20 animate-slide-up border border-white/5"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-5 shadow-lg">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
    );
}

interface StatCardProps {
    number: string;
    label: string;
}

function StatCard({ number, label }: StatCardProps) {
    return (
        <div className="glass rounded-2xl p-8 hover:scale-105 transition-all border border-white/5">
            <div className="text-5xl font-bold mb-3">
                <span className="gradient-text">{number}</span>
            </div>
            <div className="text-gray-400 text-sm uppercase tracking-wider font-semibold">{label}</div>
        </div>
    );
}
