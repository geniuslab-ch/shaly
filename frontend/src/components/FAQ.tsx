import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        question: 'Comment fonctionne Shaly ?',
        answer: 'Shaly se connecte à votre compte LinkedIn via OAuth officiel. Vous créez vos posts dans notre interface, les planifiez, et notre système les publie automatiquement à l\'heure programmée.',
    },
    {
        question: 'Est-ce que c\'est sécurisé ?',
        answer: 'Absolument ! Nous utilisons OAuth 2.0 officiel de LinkedIn avec authentification de niveau entreprise. Nous ne stockons jamais votre mot de passe LinkedIn et respectons scrupuleusement les politiques de sécurité de LinkedIn.',
    },
    {
        question: 'Puis-je publier sur plusieurs comptes ?',
        answer: 'La fonctionnalité multi-comptes arrive bientôt ! Vous pourrez gérer plusieurs profils LinkedIn et pages d\'entreprise depuis un seul tableau de bord.',
    },
    {
        question: 'Que se passe-t-il après l\'essai gratuit ?',
        answer: 'Après 14 jours, vous choisissez de passer à un plan payant (15 CHF/mois ou 132 CHF/an) ou de rester en version gratuite limitée. Aucun engagement, annulation à tout moment.',
    },
    {
        question: 'Puis-je annuler mon abonnement ?',
        answer: 'Oui, vous pouvez annuler à tout moment depuis votre tableau de bord. L\'annulation prend effet immédiatement et vous ne serez plus facturé.',
    },
    {
        question: 'Y a-t-il une limite de posts ?',
        answer: 'Avec un abonnement payant, vous avez des publications illimitées. La version gratuite est limitée à 5 posts par mois.',
    },
    {
        question: 'Quels types de contenu puis-je publier ?',
        answer: 'Actuellement, vous pouvez publier du texte. Le support images, vidéos et carrousels arrive bientôt !',
    },
    {
        question: 'Offrez-vous un support client ?',
        answer: 'Oui ! Support par email pour tous les utilisateurs, support prioritaire pour les abonnés mensuels, et support VIP pour les abonnés annuels.',
    },
    {
        question: 'Puis-je changer de plan à tout moment ?',
        answer: 'Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements sont proratisés automatiquement.',
    },
    {
        question: 'Garantissez-vous un remboursement ?',
        answer: 'Oui, satisfaction garantie sous 30 jours. Si Shaly ne répond pas à vos attentes, nous vous remboursons intégralement, sans poser de questions.',
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-gradient-to-b from-gray-800 to-gray-900">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Questions Fréquentes
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Tout ce que vous devez savoir sur Shaly
                    </p>
                </div>

                {/* FAQ List */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="glass rounded-xl overflow-hidden transition-all duration-300"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                            >
                                <span className="font-semibold pr-4">{faq.question}</span>
                                <ChevronDown
                                    className={`w-5 h-5 flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-4 text-gray-400 animate-slide-down">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-16 text-center">
                    <p className="text-gray-400 mb-4">
                        Vous avez une autre question ?
                    </p>
                    <a
                        href="mailto:support@shaly.io"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-all font-semibold"
                    >
                        Contactez-nous
                    </a>
                </div>
            </div>
        </section>
    );
}
