interface TrialBannerProps {
    daysLeft: number;
}

export default function TrialBanner({ daysLeft }: TrialBannerProps) {
    return (
        <div className="mb-6 bg-gradient-to-r from-linkedin-500/20 to-blue-500/20 border border-linkedin-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-linkedin-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="font-semibold">
                            {daysLeft} jour{daysLeft > 1 ? 's' : ''} restant{daysLeft > 1 ? 's' : ''} dans votre essai gratuit
                        </p>
                        <p className="text-sm text-gray-400">
                            Passez à un abonnement pour continuer sans interruption
                        </p>
                    </div>
                </div>
                <a
                    href="/#pricing"
                    className="px-4 py-2 bg-linkedin-500 hover:bg-linkedin-600 rounded-lg font-semibold transition-colors"
                >
                    Voir les offres
                </a>
            </div>
        </div>
    );
}
