import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Organization {
    id: string;
    name: string;
    vanityName: string;
    urn: string;
}

interface OrganizationSelectorProps {
    onSelect: (organizationUrn: string | null) => void;
    selectedOrganization: string | null;
}

export function OrganizationSelector({ onSelect, selectedOrganization }: OrganizationSelectorProps) {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrganizations();
    }, []);

    const loadOrganizations = async () => {
        try {
            const data = await apiService.getOrganizations();
            setOrganizations(data.organizations || []);
        } catch (error) {
            console.error('Failed to load organizations:', error);
            setOrganizations([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="organization-selector mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Publier en tant que :
                </label>
                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 animate-pulse">
                    Chargement...
                </div>
            </div>
        );
    }

    return (
        <div className="organization-selector mb-6">
            <label htmlFor="organization" className="block text-sm font-semibold text-gray-300 mb-2">
                Publier en tant que :
            </label>
            <select
                id="organization"
                value={selectedOrganization || 'person'}
                onChange={(e) => {
                    const value = e.target.value === 'person' ? null : e.target.value;
                    onSelect(value);
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white 
                           focus:outline-none focus:border-linkedin-500 focus:ring-2 focus:ring-linkedin-500/20
                           hover:bg-white/10 transition-all cursor-pointer backdrop-blur-sm
                           appearance-none bg-no-repeat bg-right pr-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.5em 1.5em',
                }}
            >
                <option value="person" className="bg-gray-800 text-white">
                    📱 Mon profil personnel
                </option>
                {organizations.map((org) => (
                    <option key={org.id} value={org.urn} className="bg-gray-800 text-white">
                        🏢 {org.name}
                    </option>
                ))}
            </select>
            {organizations.length === 0 && (
                <p className="mt-2 text-xs text-gray-500">
                    Aucune page d'entreprise trouvée. Vérifiez les permissions LinkedIn.
                </p>
            )}
        </div>
    );
}
