import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { apiService } from '../../services/api';

const COMMON_TIMEZONES = [
    { value: 'Europe/Zurich', label: 'Suisse (UTC+1/+2)' },
    { value: 'Europe/Paris', label: 'France/Paris (UTC+1/+2)' },
    { value: 'Europe/London', label: 'Royaume-Uni (UTC+0/+1)' },
    { value: 'Europe/Brussels', label: 'Belgique (UTC+1/+2)' },
    { value: 'America/New_York', label: 'New York (UTC-5/-4)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (UTC-8/-7)' },
    { value: 'America/Toronto', label: 'Toronto (UTC-5/-4)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (UTC+9)' },
    { value: 'Asia/Dubai', label: 'Dubai (UTC+4)' },
    { value: 'Australia/Sydney', label: 'Sydney (UTC+10/+11)' },
];

export default function ProfileSettings() {
    const [timezone, setTimezone] = useState('Europe/Zurich');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await apiService.getUserProfile();
            setTimezone(data.user.timezone || 'Europe/Zurich');
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await apiService.updateTimezone(timezone);
            setMessage({ type: 'success', text: 'Fuseau horaire mis à jour !' });
        } catch (error: any) {
            setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        ← Retour au Dashboard
                    </Link>
                    <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                        <Clock className="w-10 h-10" />
                        Paramètres du Profil
                    </h1>
                    <p className="text-gray-400">
                        Configurez votre fuseau horaire pour voir les heures locales
                    </p>
                </div>

                {/* Message */}
                {message.text && (
                    <div className={`glass rounded-xl p-4 mb-6 border-l-4 ${message.type === 'success' ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'
                        }`}>
                        <p className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
                            {message.text}
                        </p>
                    </div>
                )}

                {/* Settings Form */}
                <div className="glass rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-6">Fuseau Horaire</h2>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-linkedin-500"></div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="timezone" className="block text-sm font-semibold text-gray-300 mb-2">
                                    Sélectionnez votre fuseau horaire
                                </label>
                                <div className="relative">
                                    <select
                                        id="timezone"
                                        value={timezone}
                                        onChange={(e) => setTimezone(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white 
                                                   focus:outline-none focus:border-linkedin-500 focus:ring-2 focus:ring-linkedin-500/20
                                                   hover:bg-white/10 transition-all cursor-pointer appearance-none pr-10"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                            backgroundPosition: 'right 0.75rem center',
                                            backgroundSize: '1.5em 1.5em',
                                            backgroundRepeat: 'no-repeat'
                                        }}
                                    >
                                        {COMMON_TIMEZONES.map((tz) => (
                                            <option key={tz.value} value={tz.value} className="bg-gray-800 text-white">
                                                {tz.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <p className="mt-2 text-sm text-gray-400">
                                    Les heures de publication seront affichées dans votre fuseau horaire local
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <p className="text-sm text-gray-400">
                                    Heure actuelle: {new Date().toLocaleTimeString('fr-FR', { timeZone: timezone, hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-6 py-3 rounded-xl gradient-primary hover:shadow-xl transition-all font-semibold disabled:opacity-50"
                                >
                                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
