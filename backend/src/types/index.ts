import { Request } from 'express';

export interface User {
  id: number;
  linkedin_id: string;
  access_token: string;
  refresh_token: string;
  token_expires_at: Date;
  email: string;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ScheduledPost {
  id: number;
  user_id: number;
  content: string;
  media_urls?: string[];
  scheduled_for: Date;
  status: 'pending' | 'published' | 'failed';
  linkedin_post_id?: string;
  error_message?: string;
  created_at?: Date;
  published_at?: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

// LinkedIn Profile from userinfo endpoint (OpenID Connect)
export interface LinkedInProfile {
  id: string; // sub in OpenID Connect
  firstName: string; // given_name
  lastName: string; // family_name
  email: string;
}

export interface LinkedInTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

export interface JobData {
  postId: number;
  userId: number;
}
