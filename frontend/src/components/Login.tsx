import { Calendar, Clock, Zap, Shield, Linkedin } from 'lucide-react';
import { getLinkedInAuthUrl } from '../services/api';

export default function Login() {
    const handleLogin = () => {
        window.location.href = getLinkedInAuthUrl();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-flex items-center justify-center mb-6">
                        <img src="/shaly-logo.png" alt="Shaly Logo" className="h-24 w-auto" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        Shaly
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Automate your LinkedIn presence with intelligent post scheduling
                    </p>
                    <button
                        onClick={handleLogin}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-full gradient-primary hover:shadow-2xl hover:shadow-linkedin-500/50 transition-all duration-300 hover:scale-105"
                    >
                        <Linkedin className="w-6 h-6" />
                        Connect with LinkedIn
                        <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
                    </button>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-20">
                    <FeatureCard
                        icon={<Zap className="w-8 h-8" />}
                        title="Instant Publishing"
                        description="Publish posts immediately to your LinkedIn profile with one click"
                        delay="0"
                    />
                    <FeatureCard
                        icon={<Calendar className="w-8 h-8" />}
                        title="Smart Scheduling"
                        description="Schedule posts for optimal engagement times automatically"
                        delay="100"
                    />
                    <FeatureCard
                        icon={<Clock className="w-8 h-8" />}
                        title="Auto-Publish"
                        description="Set it and forget it - posts publish exactly when scheduled"
                        delay="200"
                    />
                    <FeatureCard
                        icon={<Shield className="w-8 h-8" />}
                        title="Secure OAuth"
                        description="Official LinkedIn API integration with enterprise-grade security"
                        delay="300"
                    />
                </div>

                {/* Stats Section */}
                <div className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
                    <StatCard number="100%" label="Reliable" />
                    <StatCard number="24/7" label="Automated" />
                    <StatCard number="∞" label="Posts" />
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-center text-gray-500 text-sm">
                <p>Powered by LinkedIn API v2 • Secure OAuth 2.0 Authentication</p>
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
            className="glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 animate-slide-up"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl gradient-primary mb-4 shadow-lg">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
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
        <div className="glass rounded-xl p-6">
            <div className="text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                {number}
            </div>
            <div className="text-gray-400 text-sm uppercase tracking-wide">{label}</div>
        </div>
    );
}
