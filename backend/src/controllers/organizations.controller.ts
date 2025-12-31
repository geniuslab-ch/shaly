import { Request, Response } from 'express';
import { linkedInService } from '../services/linkedin.service';
import { AuthRequest } from '../types';

/**
 * Get organizations that the user can administer
 */
export const getOrganizations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const { userModel } = await import('../models/user.model');

        // Get user with access token
        const user = await userModel.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Check if token is expired
        const isExpired = await userModel.isTokenExpired(userId);
        let accessToken = user.access_token;

        if (isExpired && user.refresh_token) {
            // Refresh token
            const tokenData = await linkedInService.refreshAccessToken(user.refresh_token);
            const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

            await userModel.updateTokens(
                userId,
                tokenData.access_token,
                tokenData.refresh_token || user.refresh_token,
                expiresAt
            );

            accessToken = tokenData.access_token;
        }

        // Get organizations from LinkedIn
        const organizations = await linkedInService.getOrganizations(accessToken);

        res.json({
            organizations,
        });
    } catch (error: any) {
        console.error('Error fetching organizations:', error);
        res.status(500).json({
            error: 'Failed to fetch organizations',
            message: error.message
        });
    }
};
