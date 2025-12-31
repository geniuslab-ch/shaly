import { Zap, Calendar, Clock, Shield, BarChart3, Users } from 'lucide-react';

const features = [
    {
        icon: Zap,
        title: 'Publication Instantanée',
        description: 'Publiez vos posts immédiatement sur votre profil LinkedIn en un seul clic',
        color: 'from-yellow-500 to-orange-500',
    },
    {
        icon: Calendar,
        title: 'Planification Intelligente',
        description: 'Planifiez vos posts aux moments optimaux pour maximiser l\'engagement',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        icon: Clock,
        title: 'Publication Automatique',
        description: 'Vos posts se publient automatiquement à l\'heure programmée, sans intervention',
        color: 'from-purple-500 to-pink-500',
    },
    {
        icon: Shield,
        title: 'OAuth Sécurisé',
        description: 'Intégration officielle LinkedIn avec authentification de niveau entreprise',
        color: 'from-green-500 to-emerald-500',
    },
    {
        icon: Users,
        title: 'Multi-Comptes',
        description: 'Gérez plusieurs profils et pages LinkedIn depuis un seul tableau de bord',
        color: 'from-red-500 to-rose-500',
        badge: 'Bientôt',
    },
    {
        icon: BarChart3,
        title: 'Analytics Avancées',
        description: 'Suivez les performances de vos posts et optimisez votre stratégie',
        color: 'from-indigo-500 to-blue-500',
        badge: 'Bientôt',
    },
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Tout ce dont vous avez besoin
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Des fonctionnalités puissantes pour automatiser votre présence LinkedIn
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group glass rounded-2xl p-8 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105 relative overflow-hidden"
                            >
                                {/* Badge */}
                                {feature.badge && (
                                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-linkedin-500/20 border border-linkedin-500/30 text-xs font-semibold text-linkedin-400">
                                        {feature.badge}
                                    </div>
                                )}

                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-0.5 mb-6`}>
                                    <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-semibold mb-3 group-hover:text-linkedin-400 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400">
                                    {feature.description}
                                </p>

                                {/* Hover effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl`}></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
