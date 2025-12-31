import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LegalPrivacy() {
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
                    <h1 className="text-4xl font-bold mb-8 gradient-text">Politique de Confidentialité</h1>

                    <div className="space-y-8 text-gray-300">
                        <section>
                            <p className="mb-4 text-lg">
                                Chez Shaly, nous prenons la protection de vos données personnelles très au sérieux. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">1. Données collectées</h2>
                            <p className="mb-4"><strong>1.1 Données d'authentification LinkedIn</strong></p>
                            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                                <li>Nom et prénom</li>
                                <li>Adresse email</li>
                                <li>Photo de profil LinkedIn</li>
                                <li>ID LinkedIn (identifiant unique)</li>
                                <li>Access token OAuth (chiffré)</li>
                            </ul>

                            <p className="mb-4"><strong>1.2 Données de contenu</strong></p>
                            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                                <li>Texte de vos posts planifiés</li>
                                <li>Dates et heures de planification</li>
                                <li>Statut des publications (pending, published, failed)</li>
                            </ul>

                            <p className="mb-4"><strong>1.3 Données de paiement</strong></p>
                            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                                <li>Informations traitées par Stripe (nous ne stockons jamais vos données bancaires)</li>
                                <li>Historique des abonnements</li>
                                <li>Factures</li>
                            </ul>

                            <p className="mb-4"><strong>1.4 Données techniques</strong></p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Adresse IP</li>
                                <li>Type de navigateur</li>
                                <li>Logs d'utilisation du service</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">2. Utilisation des données</h2>
                            <p className="mb-4">Nous utilisons vos données pour :</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Fournir et améliorer notre service</li>
                                <li>Publier vos posts sur LinkedIn selon vos instructions</li>
                                <li>Gérer votre compte et votre abonnement</li>
                                <li>Vous envoyer des notifications importantes</li>
                                <li>Assurer la sécurité et prévenir la fraude</li>
                                <li>Respecter nos obligations légales</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">3. Partage des données</h2>
                            <p className="mb-4">
                                <strong>3.1 LinkedIn</strong> : Nous partageons uniquement les données nécessaires à la publication de vos posts via l'API officielle LinkedIn.
                            </p>
                            <p className="mb-4">
                                <strong>3.2 Stripe</strong> : Pour le traitement des paiements (conformément à PCI DSS).
                            </p>
                            <p className="mb-4">
                                <strong>3.3 Hébergement</strong> : Render Services Inc. héberge notre infrastructure (données stockées dans l'UE).
                            </p>
                            <p>
                                <strong>Nous ne vendons jamais vos données à des tiers.</strong>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">4. Conservation des données</h2>
                            <p className="mb-4">
                                Nous conservons vos données aussi longtemps que votre compte est actif. Après suppression de votre compte :
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Suppression immédiate de vos posts et contenus</li>
                                <li>Anonymisation de vos données dans les 30 jours</li>
                                <li>Conservation des données de facturation pendant 10 ans (obligation légale)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">5. Sécurité</h2>
                            <p className="mb-4">Nous protégeons vos données avec :</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Chiffrement SSL/TLS pour toutes les communications</li>
                                <li>OAuth 2.0 officiel LinkedIn (pas de stockage de mot de passe)</li>
                                <li>Chiffrement des tokens d'accès en base de données</li>
                                <li>Backups quotidiens chiffrés</li>
                                <li>Authentification à deux facteurs (2FA) disponible</li>
                                <li>Surveillance continue des accès</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">6. Cookies</h2>
                            <p className="mb-4">
                                Nous utilisons uniquement des cookies essentiels au fonctionnement du service :
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Auth token</strong> : Pour maintenir votre session</li>
                                <li><strong>Préférences</strong> : Pour mémoriser vos choix (fuseau horaire, langue)</li>
                            </ul>
                            <p className="mt-4">
                                Nous n'utilisons <strong>pas</strong> de cookies de tracking ou publicitaires.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">7. Vos droits (RGPD)</h2>
                            <p className="mb-4">Conformément au RGPD, vous avez le droit de :</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Accès</strong> : Obtenir une copie de vos données</li>
                                <li><strong>Rectification</strong> : Corriger vos données inexactes</li>
                                <li><strong>Effacement</strong> : Supprimer votre compte et vos données</li>
                                <li><strong>Portabilité</strong> : Exporter vos données dans un format standard</li>
                                <li><strong>Opposition</strong> : Vous opposer au traitement de vos données</li>
                                <li><strong>Limitation</strong> : Demander une limitation du traitement</li>
                            </ul>
                            <p className="mt-4">
                                Pour exercer vos droits : <strong>privacy@shaly.io</strong>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">8. Transferts internationaux</h2>
                            <p>
                                Vos données sont stockées dans l'Union Européenne. En cas de transfert hors UE, nous garantissons un niveau de protection équivalent via des clauses contractuelles types.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">9. Mineurs</h2>
                            <p>
                                Shaly n'est pas destiné aux personnes de moins de 18 ans. Nous ne collectons pas sciemment de données de mineurs.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">10. Modifications</h2>
                            <p>
                                Nous pouvons modifier cette politique de confidentialité. Vous serez informé par email de tout changement significatif au moins 30 jours avant son entrée en vigueur.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">11. Contact DPO</h2>
                            <p className="mb-2">Délégué à la Protection des Données (DPO) :</p>
                            <p className="mb-2"><strong>Email :</strong> dpo@shaly.io</p>
                            <p className="mb-2"><strong>Adresse :</strong> Shaly SA, Rue de la Gare 12, 1003 Lausanne, Suisse</p>
                            <p className="mt-4">
                                <strong>Autorité de contrôle suisse :</strong> Préposé fédéral à la protection des données et à la transparence (PFPDT)
                            </p>
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
