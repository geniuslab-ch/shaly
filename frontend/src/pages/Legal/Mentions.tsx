import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LegalMentions() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Back button */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour à l'accueil
                </Link>

                {/* Content */}
                <div className="glass rounded-2xl p-8 md:p-12">
                    <h1 className="text-4xl font-bold mb-8 gradient-text">Mentions Légales</h1>

                    <div className="space-y-8 text-gray-300">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">Éditeur du site</h2>
                            <p className="mb-2"><strong>Raison sociale :</strong> Shaly</p>
                            <p className="mb-2"><strong>Forme juridique :</strong> Raison individuelle</p>
                            <p className="mb-2"><strong>Siège social :</strong> Rue de la Gare 12, 1003 Lausanne, Suisse</p>
                            <p className="mb-2"><strong>Email :</strong> contact@shaly.ch</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">Directeur de la publication</h2>
                            <p>Noura Scharer</p>
                            <p>Email : contact@shaly.ch</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">Hébergement</h2>
                            <p className="mb-2"><strong>Hébergeur :</strong> Render Services Inc.</p>
                            <p className="mb-2"><strong>Adresse :</strong> 525 Brannan St, San Francisco, CA 94107, USA</p>
                            <p className="mb-2"><strong>Site web :</strong> <a href="https://render.com" target="_blank" rel="noopener noreferrer" className="text-linkedin-500 hover:underline">render.com</a></p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">Propriété intellectuelle</h2>
                            <p className="mb-4">
                                L'ensemble du contenu de ce site (textes, images, vidéos, logos, icônes, etc.) est la propriété exclusive de Shaly SA ou de ses partenaires.
                            </p>
                            <p className="mb-4">
                                Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de Shaly SA.
                            </p>
                            <p>
                                Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions légales en vigueur.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">Crédits</h2>
                            <p className="mb-2"><strong>Design et développement :</strong> Shaly Team</p>
                            <p className="mb-2"><strong>Icônes :</strong> Lucide Icons</p>
                            <p className="mb-2"><strong>Images :</strong> Unsplash</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">Contact</h2>
                            <p className="mb-2">Pour toute question concernant les mentions légales :</p>
                            <p className="mb-2"><strong>Email :</strong> contact@shaly.ch</p>
                        </section>

                        <section className="pt-8 border-t border-white/10">
                            <p className="text-sm text-gray-400">
                                Dernière mise à jour : 31 décembre 2024
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
