import { Worker, Job } from 'bullmq';
import redis from '../config/redis';
import { JobData } from '../types';
import { postModel } from '../models/post.model';
import { userModel } from '../models/user.model';
import { linkedInService } from '../services/linkedin.service';

/**
 * Worker to process scheduled posts
 */
export function startWorker(): void {
    const worker = new Worker<JobData>(
        'publish-posts',
        async (job: Job<JobData>) => {
            const { postId, userId } = job.data;

            console.log(`📤 Processing post ${postId} for user ${userId}`);

            try {
                // Get post details
                const post = await postModel.findById(postId);
                if (!post) {
                    throw new Error(`Post ${postId} not found`);
                }

                // Skip if already published or failed
                if (post.status !== 'pending') {
                    console.log(`⏭️ Post ${postId} already ${post.status}, skipping`);
                    return { skipped: true, status: post.status };
                }

                // Get user with access token
                const user = await userModel.findById(userId);
                if (!user) {
                    throw new Error(`User ${userId} not found`);
                }

                // Check if token is expired and refresh if needed
                const isExpired = await userModel.isTokenExpired(userId);
                let accessToken = user.access_token;

                if (isExpired && user.refresh_token) {
                    console.log(`🔄 Refreshing token for user ${userId}`);
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

                // Publish to LinkedIn
                console.log(`📝 Publishing post ${postId} to LinkedIn`);
                const linkedinPostId = await linkedInService.publishPost(
                    accessToken,
                    user.linkedin_id,
                    post.content
                );

                // Update post status to published
                await postModel.updateStatus(postId, 'published', linkedinPostId);

                console.log(`✅ Successfully published post ${postId}`);
                return { success: true, linkedinPostId };
            } catch (error: any) {
                console.error(`❌ Error publishing post ${postId}:`, error.message);

                // Update post status to failed
                await postModel.updateStatus(
                    postId,
                    'failed',
                    undefined,
                    error.message
                );

                throw error; // Re-throw to trigger retry logic
            }
        },
        {
            connection: redis,
            concurrency: 5, // Process up to 5 jobs concurrently
            limiter: {
                max: 10, // Max 10 jobs
                duration: 60000, // Per minute (LinkedIn rate limiting)
            },
        }
    );

    // Event listeners
    worker.on('completed', (job) => {
        console.log(`✅ Job ${job.id} completed successfully`);
    });

    worker.on('failed', (job, err) => {
        console.error(`❌ Job ${job?.id} failed:`, err.message);
    });

    worker.on('error', (err) => {
        console.error('❌ Worker error:', err);
    });

    console.log('👷 BullMQ Worker started and listening for jobs');
}
