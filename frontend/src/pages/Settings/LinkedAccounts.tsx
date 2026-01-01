import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Plus, Trash2, CheckCircle } from 'lucide-react';
import { apiService } from '../../services/api';

interface LinkedAccount {
    id: number;
    linkedin_id: string;
    email: string;
    name: string;
    profile_picture?: string;
    is_primary: boolean;
    created_at: string;
}

export default function LinkedAccountsSettings() {
    const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadAccounts();
        checkUrlParams();
    }, []);

    const checkUrlParams = () => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('success') === 'linked') {
            setSuccess('Compte LinkedIn ajouté avec succès !');
        } else if (params.get('error') === 'already_linked') {
            setError('Ce compte LinkedIn est déjà lié.');
        } else if (params.get('error') === 'max_accounts') {
            setError('Limite de 5 comptes atteinte.');
        }
    };

    const loadAccounts = async () => {
        try {
            const data = await apiService.getLinkedAccounts();
            setAccounts(data.accounts);
        } catch (err: any) {
            setError('Erreur lors du chargement des comptes');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAccount = async () => {
        try {
            const data = await apiService.initiateAccountLink();
            window.location.href = data.authUrl;
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erreur lors de l\'ajout du compte');
        }
    };

    const handleRemoveAccount = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) return;

        try {
            await apiService.removeLinkedAccount(id);
            setSuccess('Compte supprimé avec succès');
            loadAccounts();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erreur lors de la suppression');
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
                        <Settings className="w-10 h-10" />
                        Comptes LinkedIn
                    </h1>
                    <p className="text-gray-400">
                        Gérez vos comptes LinkedIn liés (max 5 comptes)
                    </p>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="glass rounded-xl p-4 mb-6 border-l-4 border-red-500 bg-red-500/10">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}
                {success && (
                    <div className="glass rounded-xl p-4 mb-6 border-l-4 border-green-500 bg-green-500/10">
                        <p className="text-green-400">{success}</p>
                    </div>
                )}

                {/* Accounts List */}
                <div className="glass rounded-2xl p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">Comptes liés ({accounts.length}/5)</h2>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-linkedin-500"></div>
                        </div>
                    ) : accounts.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">Aucun compte lié</p>
                    ) : (
                        <div className="space-y-4">
                            {accounts.map((account) => (
                                <div
                                    key={account.id}
                                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        {account.profile_picture ? (
                                            <img
                                                src={account.profile_picture}
                                                alt={account.name}
                                                className="w-12 h-12 rounded-full"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-linkedin-500 flex items-center justify-center font-bold">
                                                {account.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">{account.name}</h3>
                                                {account.is_primary && (
                                                    <span className="flex items-center gap-1 text-xs bg-linkedin-500 px-2 py-1 rounded-full">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Principal
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-400">{account.email}</p>
                                        </div>
                                    </div>

                                    {!account.is_primary && (
                                        <button
                                            onClick={() => handleRemoveAccount(account.id)}
                                            className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                                            title="Supprimer ce compte"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add Account Button */}
                {accounts.length < 5 && (
                    <button
                        onClick={handleAddAccount}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl gradient-primary hover:shadow-xl transition-all font-semibold"
                    >
                        <Plus className="w-5 h-5" />
                        Ajouter un compte LinkedIn
                    </button>
                )}
            </div>
        </div>
    );
}
