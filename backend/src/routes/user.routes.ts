import { Router } from 'express';
import { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';
import pool from '../config/database';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get trial status for authenticated user
router.get('/trial-status', async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;

        const result = await pool.query(
            `SELECT subscription_status, trial_end_date 
             FROM users 
             WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        const now = new Date();
        const trialEndDate = user.trial_end_date ? new Date(user.trial_end_date) : null;

        let daysRemaining = 0;
        if (trialEndDate) {
            const diffTime = trialEndDate.getTime() - now.getTime();
            daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        }

        res.json({
            subscription_status: user.subscription_status || 'trial',
            trial_end_date: user.trial_end_date,
            days_remaining: daysRemaining,
            is_expired: user.subscription_status === 'trial_expired' || (trialEndDate && now > trialEndDate)
        });
    } catch (error: any) {
        console.error('Error fetching trial status:', error);
        res.status(500).json({ error: 'Failed to fetch trial status' });
    }
});

export default router;
