import Redis from 'ioredis';

// Support both REDIS_URL (Railway) and separate host/port (local dev)
const redisUrl = process.env.REDIS_URL;

let redis: Redis;

if (redisUrl) {
  // Use REDIS_URL for Railway/production
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });
} else {
  // Use separate host/port for local development
  redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    tls: process.env.REDIS_HOST?.includes('upstash') || process.env.REDIS_TLS === 'true' ? {} : undefined,
  });
}

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

export default redis;
