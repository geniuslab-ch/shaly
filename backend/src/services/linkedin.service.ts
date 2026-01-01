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
     * Get organizations (pages) that the user can administer
     */
    async getOrganizations(accessToken: string): Promise<any[]> {
        try {
            const response = await axios.get(
                'https://api.linkedin.com/v2/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&projection=(elements*(organizationalTarget~(localizedName,vanityName,id)))',
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'X-Restli-Protocol-Version': '2.0.0',
                    },
                }
            );

            // Extract organization details
            const organizations = response.data.elements?.map((item: any) => {
                const org = item['organizationalTarget~'];
                return {
                    id: org.id,
                    name: org.localizedName,
                    vanityName: org.vanityName,
                    urn: `urn:li:organization:${org.id}`,
                };
            }) || [];

            return organizations;
        } catch (error: any) {
            console.error('Error fetching organizations:', error.response?.data || error.message);
            // Return empty array if user has no organizations or API fails
            return [];
        }
    },

    /**
     * Publish a post to LinkedIn (profile or organization)
     */
    async publishPost(
        accessToken: string,
        linkedinId: string,
        content: string,
        organizationId?: string
    ): Promise<string> {
        try {
            // Use organization URN if provided, otherwise use person URN
            const author = organizationId
                ? organizationId // Already a full URN from frontend
                : `urn:li:person:${linkedinId}`;

            const postData = {
                author,
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

    /**
     * Upload image to LinkedIn (3-step process)
     */
    async uploadImage(accessToken: string, linkedinId: string, imageUrl: string): Promise<string> {
        try {
            // Step 1: Register upload
            const registerResponse = await axios.post(
                'https://api.linkedin.com/v2/assets?action=registerUpload',
                {
                    registerUploadRequest: {
                        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
                        owner: `urn:li:person:${linkedinId}`,
                        serviceRelationships: [{
                            relationshipType: 'OWNER',
                            identifier: 'urn:li:userGeneratedContent'
                        }]
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'X-Restli-Protocol-Version': '2.0.0'
                    }
                }
            );

            const uploadUrl = registerResponse.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
            const asset = registerResponse.data.value.asset;

            // Step 2: Upload image to LinkedIn CDN
            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            await axios.put(uploadUrl, imageResponse.data, {
                headers: { 'Content-Type': 'application/octet-stream' }
            });

            // Return asset URN for use in post
            return asset;
        } catch (error: any) {
            console.error('Error uploading image to LinkedIn:', error.response?.data || error.message);
            throw new Error('Failed to upload image to LinkedIn');
        }
    },

    /**
     * Publish post with images
     */
    async publishPostWithMedia(
        accessToken: string,
        linkedinId: string,
        content: string,
        mediaUrls: string[],
        organizationId?: string
    ): Promise<string> {
        try {
            // Upload all images and get asset URNs
            const assetUrns = await Promise.all(
                mediaUrls.map(url => this.uploadImage(accessToken, linkedinId, url))
            );

            const author = organizationId || `urn:li:person:${linkedinId}`;

            const postData = {
                author,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: { text: content },
                        shareMediaCategory: 'IMAGE',
                        media: assetUrns.map(asset => ({
                            status: 'READY',
                            media: asset
                        }))
                    }
                },
                visibility: {
                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                }
            };

            const response = await axios.post(linkedInConfig.ugcPostsURL, postData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-Restli-Protocol-Version': '2.0.0'
                }
            });

            return response.data.id || response.headers['x-restli-id'];
        } catch (error: any) {
            console.error('Error publishing post with media:', error.response?.data || error.message);
            throw new Error('Failed to publish post with media');
        }
    },

    /**
     * Publish post with article URL
     */
    async publishPostWithArticle(
        accessToken: string,
        linkedinId: string,
        content: string,
        articleUrl: string,
        organizationId?: string
    ): Promise<string> {
        try {
            const author = organizationId || `urn:li:person:${linkedinId}`;

            const postData = {
                author,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: { text: content },
                        shareMediaCategory: 'ARTICLE',
                        media: [{
                            status: 'READY',
                            originalUrl: articleUrl
                        }]
                    }
                },
                visibility: {
                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                }
            };

            const response = await axios.post(linkedInConfig.ugcPostsURL, postData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-Restli-Protocol-Version': '2.0.0'
                }
            });

            return response.data.id || response.headers['x-restli-id'];
        } catch (error: any) {
            console.error('Error publishing article:', error.response?.data || error.message);
            throw new Error('Failed to publish article');
        }
    },
};
