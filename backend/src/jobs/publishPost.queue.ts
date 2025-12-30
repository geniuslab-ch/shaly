import { Queue } from 'bullmq';
import redis from '../config/redis';
import { JobData } from '../types';

// Create the queue
export const publishQueue = new Queue<JobData>('publish-posts', {
    connection: redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: {
            age: 24 * 3600, // Keep completed jobs for 24 hours
            count: 1000,
        },
        removeOnFail: {
            age: 7 * 24 * 3600, // Keep failed jobs for 7 days
        },
    },
});

/**
 * Schedule a post to be published at a specific time
 */
export async function schedulePost(
    postId: number,
    userId: number,
    scheduledFor: Date
): Promise<void> {
    const delay = scheduledFor.getTime() - Date.now();

    if (delay < 0) {
        throw new Error('Scheduled time must be in the future');
    }

    await publishQueue.add(
        'publish-post',
        { postId, userId },
        {
            delay,
            jobId: `post-${postId}`, // Unique job ID to prevent duplicates
        }
    );

    console.log(`📅 Scheduled post ${postId} for ${scheduledFor.toISOString()}`);
}

/**
 * Remove a scheduled post job
 */
export async function removeScheduledPost(postId: number): Promise<void> {
    const jobId = `post-${postId}`;
    const job = await publishQueue.getJob(jobId);

    if (job) {
        await job.remove();
        console.log(`🗑️ Removed scheduled job for post ${postId}`);
    }
}
