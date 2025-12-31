import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';

export interface AuthRequest extends Request {
    user?: {
        id: number;
        linkedinId: string;
        name: string;
        email: string;
        profilePicture?: string;
        subscription_status?: string;
        trial_end_date?: Date;
    };
}

export async function checkTrialStatus(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const userId = req.user.id;

        // Get user's subscription status
        const result = await pool.query(
            `SELECT subscription_status, trial_end_date, stripe_subscription_id 
       FROM users 
       WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        const now = new Date();

        // Allow access if user has active subscription
        if (user.subscription_status === 'active' && user.stripe_subscription_id) {
            return next();
        }

        // Check if trial is still valid
        if (user.subscription_status === 'trial') {
            const trialEndDate = new Date(user.trial_end_date);

            if (now <= trialEndDate) {
                // Trial still valid
                return next();
            } else {
                // Trial expired - update status
                await pool.query(
                    `UPDATE users SET subscription_status = 'trial_expired' WHERE id = $1`,
                    [userId]
                );

                return res.status(402).json({
                    error: 'Trial period expired',
                    message: 'Your 14-day free trial has expired. Please subscribe to continue using Shaly.',
                    trial_end_date: user.trial_end_date
                });
            }
        }

        // Trial expired or subscription canceled
        if (user.subscription_status === 'trial_expired' || user.subscription_status === 'canceled') {
            return res.status(402).json({
                error: 'Subscription required',
                message: 'Please subscribe to access Shaly.',
                subscription_status: user.subscription_status
            });
        }

        // Default: allow access for any other status during transition
        next();
    } catch (error) {
        console.error('Trial check error:', error);
        res.status(500).json({ error: 'Failed to check trial status' });
    }
}
