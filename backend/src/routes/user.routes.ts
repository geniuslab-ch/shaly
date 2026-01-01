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

// Get user profile including timezone
router.get('/profile', async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;

        const result = await pool.query(
            `SELECT id, email, name, profile_picture, timezone 
             FROM users 
             WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: result.rows[0] });
    } catch (error: any) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

// Update user timezone
router.patch('/timezone', async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { timezone } = req.body;

        if (!timezone || typeof timezone !== 'string') {
            return res.status(400).json({ error: 'Valid timezone is required' });
        }

        // Basic timezone validation (check format)
        if (timezone.length > 50 || !/^[A-Za-z_\/]+$/.test(timezone)) {
            return res.status(400).json({ error: 'Invalid timezone format' });
        }

        await pool.query(
            `UPDATE users SET timezone = $1 WHERE id = $2`,
            [timezone, userId]
        );

        res.json({ success: true, timezone });
    } catch (error: any) {
        console.error('Error updating timezone:', error);
        res.status(500).json({ error: 'Failed to update timezone' });
    }
});

export default router;
