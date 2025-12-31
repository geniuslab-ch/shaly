import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface TrialStatus {
    subscription_status: string;
    trial_end_date: string | null;
    days_remaining: number;
    is_expired: boolean;
}

export function useTrialStatus() {
    const [status, setStatus] = useState<TrialStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTrialStatus();
    }, []);

    const loadTrialStatus = async () => {
        try {
            const data = await apiService.getTrialStatus();
            setStatus(data);
        } catch (error) {
            console.error('Failed to load trial status:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        trialDaysRemaining: status?.days_remaining || 0,
        isExpired: status?.is_expired || false,
        subscriptionStatus: status?.subscription_status || 'unknown',
        loading
    };
}
