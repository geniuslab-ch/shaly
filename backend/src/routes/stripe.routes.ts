import { Router, Request, Response } from 'express';
import express from 'express';
import pool from '../config/database';

const router = Router();

// Stripe webhook endpoint - RAW BODY REQUIRED
router.post('/webhook',
    express.raw({ type: 'application/json' }), // Parse raw body for Stripe signature verification
    async (req: Request, res: Response) => {
        try {
            const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
            const sig = req.headers['stripe-signature'];
            const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

            if (!webhookSecret) {
                console.error('STRIPE_WEBHOOK_SECRET not configured');
                return res.status(500).json({ error: 'Webhook secret not configured' });
            }

            let event;

            // Verify Stripe signature
            try {
                event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
            } catch (err: any) {
                console.error('⚠️  Webhook signature verification failed:', err.message);
                return res.status(400).send(`Webhook Error: ${err.message}`);
            }

            console.log('✅ Stripe webhook received:', event.type);

            // Handle different event types
            switch (event.type) {
                case 'checkout.session.completed': {
                    const session = event.data.object;
                    console.log('💳 Checkout session completed:', session.id);

                    // Get customer email and subscription
                    const customerEmail = session.customer_email || session.customer_details?.email;
                    const stripeCustomerId = session.customer;
                    const stripeSubscriptionId = session.subscription;

                    if (!customerEmail) {
                        console.error('No email found in checkout session');
                        break;
                    }

                    // Update user subscription status
                    const result = await pool.query(
                        `UPDATE users 
                         SET subscription_status = 'active',
                             stripe_customer_id = $1,
                             stripe_subscription_id = $2
                         WHERE email = $3
                         RETURNING id, name, email`,
                        [stripeCustomerId, stripeSubscriptionId, customerEmail]
                    );

                    if (result.rows.length > 0) {
                        console.log('✅ User subscription activated:', result.rows[0]);
                    } else {
                        console.error('⚠️  No user found with email:', customerEmail);
                    }
                    break;
                }

                case 'customer.subscription.updated': {
                    const subscription = event.data.object;
                    const stripeCustomerId = subscription.customer;

                    // Determine status based on subscription state
                    let newStatus = 'active';
                    if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
                        newStatus = 'canceled';
                    } else if (subscription.status === 'past_due') {
                        newStatus = 'trial_expired'; // Treat as expired
                    }

                    await pool.query(
                        `UPDATE users 
                         SET subscription_status = $1
                         WHERE stripe_customer_id = $2`,
                        [newStatus, stripeCustomerId]
                    );

                    console.log(`✅ Subscription ${subscription.id} updated to ${newStatus}`);
                    break;
                }

                case 'customer.subscription.deleted': {
                    const subscription = event.data.object;
                    const stripeCustomerId = subscription.customer;

                    await pool.query(
                        `UPDATE users 
                         SET subscription_status = 'canceled'
                         WHERE stripe_customer_id = $1`,
                        [stripeCustomerId]
                    );

                    console.log(`✅ Subscription ${subscription.id} canceled`);
                    break;
                }

                case 'invoice.payment_failed': {
                    const invoice = event.data.object;
                    const stripeCustomerId = invoice.customer;

                    // Mark as past due / expired
                    await pool.query(
                        `UPDATE users 
                         SET subscription_status = 'trial_expired'
                         WHERE stripe_customer_id = $1`,
                        [stripeCustomerId]
                    );

                    console.log(`⚠️  Payment failed for customer ${stripeCustomerId}`);
                    break;
                }

                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }

            // Return 200 to acknowledge receipt
            res.json({ received: true });
        } catch (error: any) {
            console.error('Error processing webhook:', error);
            res.status(500).json({ error: 'Webhook processing failed' });
        }
    }
);

export default router;
