import { Router, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';
import { LinkedAccountModel } from '../models/linkedAccount.model';

const router = Router();

// Maximum linked accounts per user
const MAX_LINKED_ACCOUNTS = 5;

/**
 * GET /api/linked-accounts
 * Get all linked accounts for the current user
 */
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const accounts = await LinkedAccountModel.findByUserId(userId);

        // Don't send full access tokens to frontend
        const sanitizedAccounts = accounts.map(account => ({
            id: account.id,
            linkedin_id: account.linkedin_id,
            email: account.email,
            name: account.name,
            profile_picture: account.profile_picture,
            is_primary: account.is_primary,
            created_at: account.created_at
        }));

        res.json({ accounts: sanitizedAccounts });
    } catch (error: any) {
        console.error('Error fetching linked accounts:', error);
        res.status(500).json({ error: 'Failed to fetch linked accounts' });
    }
});

/**
 * GET /api/linked-accounts/:id
 * Get a specific linked account  
 */
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const accountId = parseInt(req.params.id);

        const account = await LinkedAccountModel.findById(accountId, userId);
        if (!account) {
            return res.status(404).json({ error: 'Linked account not found' });
        }

        // Don't send access token
        const sanitizedAccount = {
            id: account.id,
            linkedin_id: account.linkedin_id,
            email: account.email,
            name: account.name,
            profile_picture: account.profile_picture,
            is_primary: account.is_primary,
            created_at: account.created_at
        };

        res.json({ account: sanitizedAccount });
    } catch (error: any) {
        console.error('Error fetching linked account:', error);
        res.status(500).json({ error: 'Failed to fetch linked account' });
    }
});

/**
 * DELETE /api/linked-accounts/:id
 * Remove a linked account (not the primary one)
 */
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const accountId = parseInt(req.params.id);

        const deleted = await LinkedAccountModel.delete(accountId, userId);

        if (!deleted) {
            return res.status(400).json({
                error: 'Cannot delete this account. It may be your primary account or not found.'
            });
        }

        res.json({ success: true, message: 'Linked account removed successfully' });
    } catch (error: any) {
        console.error('Error deleting linked account:', error);

        if (error.message === 'Cannot delete primary linked account') {
            return res.status(400).json({ error: error.message });
        }

        res.status(500).json({ error: 'Failed to delete linked account' });
    }
});

/**
 * GET /api/linked-accounts/connect/initiate
 * Get LinkedIn OAuth URL for adding another account
 */
router.get('/connect/initiate', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;

        // Check account limit
        const accountCount = await LinkedAccountModel.countByUserId(userId);
        if (accountCount >= MAX_LINKED_ACCOUNTS) {
            return res.status(400).json({
                error: `Maximum of ${MAX_LINKED_ACCOUNTS} linked accounts reached`
            });
        }

        // Generate OAuth URL with state containing user ID
        const state = Buffer.from(JSON.stringify({
            userId,
            action: 'link_account',
            timestamp: Date.now()
        })).toString('base64');

        const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
            `response_type=code&` +
            `client_id=${process.env.LINKEDIN_CLIENT_ID}&` +
            `redirect_uri=${encodeURIComponent(process.env.LINKEDIN_REDIRECT_URI || '')}&` +
            `state=${state}&` +
            `scope=openid%20profile%20email%20w_member_social`;

        res.json({ authUrl });
    } catch (error: any) {
        console.error('Error initiating account link:', error);
        res.status(500).json({ error: 'Failed to initiate account linking' });
    }
});

export default router;
