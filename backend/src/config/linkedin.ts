export const linkedInConfig = {
  clientId: process.env.LINKEDIN_CLIENT_ID!,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
  redirectUri: process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:3000/auth/linkedin/callback',
  scope: 'openid profile email w_member_social', // Updated scopes for LinkedIn API v2
  authorizationURL: 'https://www.linkedin.com/oauth/v2/authorization',
  tokenURL: 'https://www.linkedin.com/oauth/v2/accessToken',
  profileURL: 'https://api.linkedin.com/v2/userinfo', // Updated endpoint
  emailURL: 'https://api.linkedin.com/v2/userinfo', // Email is now in userinfo
  ugcPostsURL: 'https://api.linkedin.com/v2/ugcPosts',
  assetsURL: 'https://api.linkedin.com/v2/assets'
};

// Validation de la configuration
if (!linkedInConfig.clientId || !linkedInConfig.clientSecret) {
  throw new Error('LinkedIn credentials not configured. Please set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET in .env');
}
