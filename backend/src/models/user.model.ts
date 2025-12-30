import pool from '../config/database';
import { User } from '../types';

export const userModel = {
  /**
   * Find user by LinkedIn ID
   */
  async findByLinkedInId(linkedinId: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE linkedin_id = $1',
      [linkedinId]
    );
    return result.rows[0] || null;
  },

  /**
   * Find user by ID
   */
  async findById(id: number): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  /**
   * Create new user
   */
  async create(userData: {
    linkedin_id: string;
    access_token: string;
    refresh_token: string;
    token_expires_at: Date;
    email: string;
    name: string;
  }): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (linkedin_id, access_token, refresh_token, token_expires_at, email, name)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        userData.linkedin_id,
        userData.access_token,
        userData.refresh_token,
        userData.token_expires_at,
        userData.email,
        userData.name,
      ]
    );
    return result.rows[0];
  },

  /**
   * Update user tokens
   */
  async updateTokens(
    userId: number,
    accessToken: string,
    refreshToken: string,
    expiresAt: Date
  ): Promise<User> {
    const result = await pool.query(
      `UPDATE users 
       SET access_token = $1, refresh_token = $2, token_expires_at = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [accessToken, refreshToken, expiresAt, userId]
    );
    return result.rows[0];
  },

  /**
   * Check if token is expired
   */
  async isTokenExpired(userId: number): Promise<boolean> {
    const result = await pool.query(
      'SELECT token_expires_at FROM users WHERE id = $1',
      [userId]
    );
    if (!result.rows[0]) return true;
    
    const expiresAt = new Date(result.rows[0].token_expires_at);
    return expiresAt <= new Date();
  },
};
