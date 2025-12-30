import axios from 'axios';
import { linkedInConfig } from '../config/linkedin';
import { LinkedInTokenResponse, LinkedInProfile } from '../types';

export const linkedInService = {
    /**
     * Exchange authorization code for access token
     */
    async getAccessToken(code: string): Promise<LinkedInTokenResponse> {
        try {
            const response = await axios.post(
                linkedInConfig.tokenURL,
                null,
                {
                    params: {
                        grant_type: 'authorization_code',
                        code,
                        client_id: linkedInConfig.clientId,
                        client_secret: linkedInConfig.clientSecret,
                        redirect_uri: linkedInConfig.redirectUri,
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            console.error('Error getting access token:', error.response?.data || error.message);
            throw new Error('Failed to get access token from LinkedIn');
        }
    },

    /**
     * Refresh access token
     */
    async refreshAccessToken(refreshToken: string): Promise<LinkedInTokenResponse> {
        try {
            const response = await axios.post(
                linkedInConfig.tokenURL,
                null,
                {
                    params: {
                        grant_type: 'refresh_token',
                        refresh_token: refreshToken,
                        client_id: linkedInConfig.clientId,
                        client_secret: linkedInConfig.clientSecret,
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            console.error('Error refreshing token:', error.response?.data || error.message);
            throw new Error('Failed to refresh access token');
        }
    },

    /**
     * Get user profile and email from LinkedIn (using new userinfo endpoint)
     */
    async getUserProfile(accessToken: string): Promise<LinkedInProfile> {
        try {
            const response = await axios.get(linkedInConfig.profileURL, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            return {
                id: response.data.sub, // OpenID Connect standard
                firstName: response.data.given_name || '',
                lastName: response.data.family_name || '',
                email: response.data.email || '',
            };
        } catch (error: any) {
            console.error('Error fetching LinkedIn profile:', error.response?.data || error.message);
            throw new Error('Failed to fetch LinkedIn profile');
        }
    },

    /**
     * Publish a post to LinkedIn
     */
    async publishPost(accessToken: string, linkedinId: string, content: string): Promise<string> {
        try {
            const postData = {
                author: `urn:li:person:${linkedinId}`,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: {
                            text: content,
                        },
                        shareMediaCategory: 'NONE',
                    },
                },
                visibility: {
                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
                },
            };

            const response = await axios.post(
                linkedInConfig.ugcPostsURL,
                postData,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'X-Restli-Protocol-Version': '2.0.0',
                    },
                }
            );

            // Extract post ID from response
            const postId = response.data.id || response.headers['x-restli-id'];
            return postId;
        } catch (error: any) {
            console.error('Error publishing post:', error.response?.data || error.message);

            // Handle specific LinkedIn API errors
            if (error.response?.status === 429) {
                throw new Error('LinkedIn API rate limit exceeded. Please try again later.');
            }

            if (error.response?.status === 401) {
                throw new Error('LinkedIn access token expired. Please re-authenticate.');
            }

            throw new Error(error.response?.data?.message || 'Failed to publish post to LinkedIn');
        }
    },
};
