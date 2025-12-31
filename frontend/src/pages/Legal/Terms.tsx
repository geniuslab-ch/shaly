import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LegalTerms() {
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
                    <h1 className="text-4xl font-bold mb-8 gradient-text">Conditions d'Utilisation</h1>

                    <div className="space-y-8 text-gray-300">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptation des conditions</h2>
                            <p className="mb-4">
                                En accédant et en utilisant Shaly, vous acceptez d'être lié par les présentes conditions d'utilisation, toutes les lois et réglementations applicables.
                            </p>
                            <p>
                                Si vous n'acceptez pas l'une de ces conditions, vous n'êtes pas autorisé à utiliser ou accéder à ce service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">2. Description du service</h2>
                            <p className="mb-4">
                                Shaly est une plateforme SaaS permettant d'automatiser la publication de contenu sur LinkedIn. Le service comprend :
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Planification de posts LinkedIn</li>
                                <li>Publication automatique</li>
                                <li>Gestion multi-comptes (à venir)</li>
                                <li>Analytics de performance (à venir)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">3. Compte utilisateur</h2>
                            <p className="mb-4">
                                <strong>3.1 Inscription</strong> : Pour utiliser Shaly, vous devez créer un compte en vous connectant avec LinkedIn via OAuth 2.0.
                            </p>
                            <p className="mb-4">
                                <strong>3.2 Sécurité</strong> : Vous êtes responsable de maintenir la confidentialité de votre compte et de toutes les activités qui se produisent sous votre compte.
                            </p>
                            <p>
                                <strong>3.3 Suspicion</strong> : Vous devez nous informer immédiatement de toute utilisation non autorisée de votre compte.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">4. Tarification et abonnements</h2>
                            <p className="mb-4">
                                <strong>4.1 Essai gratuit</strong> : Shaly offre un essai gratuit de 14 jours sans engagement ni carte bancaire.
                            </p>
                            <p className="mb-4">
                                <strong>4.2 Abonnements payants</strong> :
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                                <li>Mensuel : 15 CHF/mois</li>
                                <li>Annuel : 132 CHF/an (économie de 48 CHF)</li>
                            </ul>
                            <p className="mb-4">
                                <strong>4.3 Paiements</strong> : Les paiements sont traités par Stripe. Tous les abonnements sont renouvelés automatiquement.
                            </p>
                            <p>
                                <strong>4.4 Remboursement</strong> : Nous offrons une garantie satisfait ou remboursé de 30 jours sur tous les nouveaux abonnements.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">5. Résiliation</h2>
                            <p className="mb-4">
                                <strong>5.1 Par l'utilisateur</strong> : Vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord.
                            </p>
                            <p className="mb-4">
                                <strong>5.2 Par Shaly</strong> : Nous nous réservons le droit de suspendre ou résilier votre compte en cas de violation des présentes conditions.
                            </p>
                            <p>
                                <strong>5.3 Effet</strong> : En cas de résiliation, vous perdez immédiatement l'accès à votre compte et à toutes vos données.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">6. Utilisation acceptable</h2>
                            <p className="mb-4">Vous vous engagez à ne pas :</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Violer les conditions d'utilisation de LinkedIn</li>
                                <li>Publier du contenu illégal, diffamatoire ou offensant</li>
                                <li>Utiliser le service pour du spam ou des activités frauduleuses</li>
                                <li>Tenter de contourner les limitations du service</li>
                                <li>Reverse engineer ou copier le code source</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">7. Propriété intellectuelle</h2>
                            <p className="mb-4">
                                Shaly et ses contenus (code, design, logos, textes) sont protégés par le droit d'auteur et restent la propriété exclusive de Shaly SA.
                            </p>
                            <p>
                                Le contenu que vous publiez via Shaly reste votre propriété. Vous nous accordez une licence limitée pour traiter et publier ce contenu.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">8. Limitation de responsabilité</h2>
                            <p className="mb-4">
                                Shaly est fourni "tel quel" sans garantie d'aucune sorte. Nous ne garantissons pas que le service sera ininterrompu ou exempt d'erreurs.
                            </p>
                            <p>
                                En aucun cas Shaly ne sera responsable de dommages indirects, accessoires ou consécutifs résultant de l'utilisation du service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">9. Modifications</h2>
                            <p>
                                Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications seront effectives dès leur publication sur le site. Votre utilisation continue du service après les modifications constitue votre acceptation des nouvelles conditions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">10. Droit applicable</h2>
                            <p className="mb-4">
                                Les présentes conditions sont régies par le droit suisse. Tout litige sera soumis à la juridiction exclusive des tribunaux de Lausanne, Suisse.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">11. Contact</h2>
                            <p className="mb-2">Pour toute question concernant ces conditions :</p>
                            <p><strong>Email :</strong> legal@shaly.io</p>
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
