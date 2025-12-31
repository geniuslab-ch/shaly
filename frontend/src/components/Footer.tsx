import { Linkedin, Twitter, Mail } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 border-t border-white/10">
            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <h3 className="text-2xl font-bold gradient-text mb-4">Shaly</h3>
                        <p className="text-gray-400 mb-4">
                            Automatisez votre présence LinkedIn avec intelligence.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            <a
                                href="https://linkedin.com/company/shaly"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-linkedin-500/20 transition-colors"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a
                                href="https://twitter.com/shaly_io"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-blue-500/20 transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="mailto:contact@shaly.io"
                                className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-gray-500/20 transition-colors"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="font-semibold mb-4">Produit</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                                    Fonctionnalités
                                </a>
                            </li>
                            <li>
                                <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                                    Tarifs
                                </a>
                            </li>
                            <li>
                                <a href="/blog" className="text-gray-400 hover:text-white transition-colors">
                                    Blog
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold mb-4">Légal</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="/legal/mentions" className="text-gray-400 hover:text-white transition-colors">
                                    Mentions légales
                                </a>
                            </li>
                            <li>
                                <a href="/legal/terms" className="text-gray-400 hover:text-white transition-colors">
                                    Conditions d'utilisation
                                </a>
                            </li>
                            <li>
                                <a href="/legal/privacy" className="text-gray-400 hover:text-white transition-colors">
                                    Politique de confidentialité
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-400 text-sm">
                        © {currentYear} Shaly. All rights reserved.
                    </p>
                    <p className="text-gray-400 text-sm">
                        Made with ❤️ in Switzerland
                    </p>
                </div>
            </div>
        </footer>
    );
}
