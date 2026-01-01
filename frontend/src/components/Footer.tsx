export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 border-t border-white/10">
            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/shaly-logo.png" alt="Shaly Logo" className="w-10 h-10" />
                            <h3 className="text-2xl font-bold gradient-text">Shaly</h3>
                        </div>
                        <p className="text-gray-400">
                            Automatisez votre présence LinkedIn avec intelligence.
                        </p>
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
