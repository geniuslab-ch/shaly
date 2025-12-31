import { Request, Response } from 'express';
import { linkedInConfig } from '../config/linkedin';
import { linkedInService } from '../services/linkedin.service';
import { userModel } from '../models/user.model';
import { generateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

export const authController = {
    /**
     * Initiate LinkedIn OAuth flow
     */
    initiateAuth: asyncHandler(async (req: Request, res: Response) => {
        const authUrl = `${linkedInConfig.authorizationURL}?response_type=code&client_id=${linkedInConfig.clientId}&redirect_uri=${encodeURIComponent(linkedInConfig.redirectUri)}&scope=${encodeURIComponent(linkedInConfig.scope)}`;

        res.redirect(authUrl);
    }),

    /**
     * Handle LinkedIn OAuth callback
     */
    handleCallback: asyncHandler(async (req: Request, res: Response) => {
        const { code, error } = req.query;

        // Handle OAuth errors
        if (error) {
            console.error('OAuth error:', error);
            return res.redirect(`${process.env.FRONTEND_URL}?error=oauth_failed`);
        }

        if (!code || typeof code !== 'string') {
            return res.redirect(`${process.env.FRONTEND_URL}?error=no_code`);
        }

        try {
            // Exchange code for access token
            const tokenData = await linkedInService.getAccessToken(code);

            // Get user profile and email (now in one call)
            const profile = await linkedInService.getUserProfile(tokenData.access_token);

            // Check if user exists
            let user = await userModel.findByLinkedInId(profile.id);

            if (!user) {
                // Create new user with 14-day trial
                const now = new Date();
                const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days

                user = await userModel.create({
                    linkedin_id: profile.id,
                    access_token: tokenData.access_token,
                    refresh_token: tokenData.refresh_token || '',
                    token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000),
                    email: profile.email,
                    name: `${profile.firstName} ${profile.lastName}`.trim(),
                    trial_start_date: now,
                    trial_end_date: trialEnd,
                    subscription_status: 'trial'
                });
            } else {
                // Update existing user's tokens
                user = await userModel.updateTokens(
                    user.id,
                    tokenData.access_token,
                    tokenData.refresh_token || user.refresh_token || '',
                    new Date(Date.now() + tokenData.expires_in * 1000)
                );
            }

            // Generate JWT token
            const jwtToken = generateToken(user.id, user.email);

            // Redirect to frontend with token
            res.redirect(`${process.env.FRONTEND_URL}?token=${jwtToken}`);
        } catch (error: any) {
            console.error('Error in OAuth callback:', error);
            res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
        }
    }),

    /**
     * Check authentication status
     */
    checkStatus: asyncHandler(async (req: Request, res: Response) => {
        // This route is protected by authenticateToken middleware
        const user = await userModel.findById(req.user!.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            authenticated: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    }),
};
