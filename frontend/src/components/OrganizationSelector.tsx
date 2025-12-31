import { useState, useEffect } from 'react';
import { api } from '../services/api';

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
            const data = await api.getOrganizations();
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
            <div className="organization-selector">
                <label>Publier en tant que :</label>
                <select disabled>
                    <option>Chargement...</option>
                </select>
            </div>
        );
    }

    return (
        <div className="organization-selector">
            <label htmlFor="organization">Publier en tant que :</label>
            <select
                id="organization"
                value={selectedOrganization || 'person'}
                onChange={(e) => {
                    const value = e.target.value === 'person' ? null : e.target.value;
                    onSelect(value);
                }}
                className="form-select"
            >
                <option value="person">📱 Mon profil personnel</option>
                {organizations.map((org) => (
                    <option key={org.id} value={org.urn}>
                        🏢 {org.name}
                    </option>
                ))}
            </select>
            {organizations.length === 0 && (
                <small className="text-muted">
                    Aucune page d'entreprise trouvée. Connectez-vous avec les permissions d'organisation.
                </small>
            )}
        </div>
    );
}
