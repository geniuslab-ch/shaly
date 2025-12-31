import { Star } from 'lucide-react';

const testimonials = [
    {
        name: 'Sophie Martin',
        role: 'Marketing Manager',
        company: 'TechStart SA',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        content: 'Shaly a transformé ma présence LinkedIn. Je gagne 5h par semaine et mon engagement a doublé en 2 mois !',
        rating: 5,
    },
    {
        name: 'Marc Dubois',
        role: 'CEO & Founder',
        company: 'InnovateLab',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        content: 'La planification automatique est un game-changer. Plus besoin de penser à publier, tout est automatisé.',
        rating: 5,
    },
    {
        name: 'Claire Rousseau',
        role: 'Content Creator',
        company: 'Freelance',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        content: 'Interface intuitive, support réactif, et surtout des résultats concrets. Je recommande à 100% !',
        rating: 5,
    },
    {
        name: 'Thomas Bernard',
        role: 'Growth Hacker',
        company: 'ScaleUp GmbH',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        content: 'Le meilleur outil pour gérer sa présence LinkedIn. Simple, efficace, et abordable.',
        rating: 5,
    },
];

export default function Testimonials() {
    return (
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Ce que disent nos utilisateurs
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Découvrez comment Shaly aide des professionnels à développer leur présence LinkedIn
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="glass rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:transform hover:-translate-y-2"
                        >
                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="text-gray-300 mb-6 italic">
                                "{testimonial.content}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <div className="font-semibold">{testimonial.name}</div>
                                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                                    <div className="text-xs text-gray-500">{testimonial.company}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
                    <div className="text-center">
                        <div className="text-4xl font-bold gradient-text mb-2">500+</div>
                        <div className="text-gray-400">Utilisateurs Actifs</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold gradient-text mb-2">10K+</div>
                        <div className="text-gray-400">Posts Publiés</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold gradient-text mb-2">98%</div>
                        <div className="text-gray-400">Satisfaction</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold gradient-text mb-2">5h</div>
                        <div className="text-gray-400">Économisées/semaine</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
