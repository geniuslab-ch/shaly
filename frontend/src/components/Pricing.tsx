import { Check, Sparkles } from 'lucide-react';

const plans = [
    {
        name: 'Essai Gratuit',
        price: '0',
        period: '14 jours',
        description: 'Testez toutes les fonctionnalités sans engagement',
        features: [
            'Toutes les fonctionnalités',
            'Publication illimitée',
            'Support par email',
            'Sans carte bancaire',
        ],
        cta: 'Commencer Gratuitement',
        ctaLink: '/login',
        popular: false,
    },
    {
        name: 'Mensuel',
        price: '15',
        period: 'mois',
        description: 'Parfait pour commencer',
        features: [
            'Publication illimitée',
            'Planification intelligente',
            'Support prioritaire',
            'Fuseaux horaires multiples',
            'Multi-comptes (bientôt)',
            'Analytics (bientôt)',
        ],
        cta: 'S\'abonner Maintenant',
        ctaLink: 'https://buy.stripe.com/6oU14n6rreqAgu04mD1Nu00',
        popular: false,
    },
    {
        name: 'Annuel',
        price: '132',
        period: 'an',
        savings: 'Économisez 48 CHF',
        description: 'La meilleure offre',
        features: [
            'Tout du plan mensuel',
            '2 mois offerts',
            'Support VIP',
            'Accès anticipé aux nouvelles fonctionnalités',
            'Consultation stratégie LinkedIn',
        ],
        cta: 'S\'abonner Maintenant',
        ctaLink: 'https://buy.stripe.com/28E00j033gyIelScT91Nu01',
        popular: true,
    },
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-gradient-to-b from-gray-800 to-gray-900">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Tarifs Simples et Transparents
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Choisissez le plan qui correspond à vos besoins. Annulez à tout moment.
                    </p>
                </div>

                {/* Pricing Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative glass rounded-2xl p-8 ${plan.popular
                                ? 'border-2 border-linkedin-500 transform scale-105'
                                : 'border border-white/10'
                                } transition-all duration-300 hover:transform hover:scale-105`}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full gradient-primary text-sm font-semibold">
                                        <Sparkles className="w-4 h-4" />
                                        Meilleure Offre
                                    </div>
                                </div>
                            )}

                            {/* Plan Name */}
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <p className="text-gray-400 mb-6">{plan.description}</p>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold">{plan.price}</span>
                                    <span className="text-gray-400">CHF</span>
                                    <span className="text-gray-400">/ {plan.period}</span>
                                </div>
                                {plan.savings && (
                                    <div className="mt-2 text-green-400 text-sm font-semibold">
                                        {plan.savings}
                                    </div>
                                )}
                            </div>

                            {/* CTA */}
                            {/* CTA */}
                            <a
                                href={plan.ctaLink}
                                target={plan.ctaLink.startsWith('http') ? '_blank' : undefined}
                                rel={plan.ctaLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className={`block text-center w-full py-3 rounded-xl font-semibold mb-8 transition-all duration-300 ${plan.popular
                                        ? 'gradient-primary hover:shadow-lg hover:shadow-linkedin-500/50'
                                        : 'border border-white/10 hover:bg-white/5'
                                    }`}
                            >
                                {plan.cta}
                            </a>

                            {/* Features */}
                            <ul className="space-y-4">
                                {plan.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Money Back Guarantee */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-green-500/30 bg-green-500/10">
                        <Check className="w-5 h-5 text-green-400" />
                        <span className="font-semibold text-green-400">
                            Satisfait ou remboursé sous 30 jours
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
