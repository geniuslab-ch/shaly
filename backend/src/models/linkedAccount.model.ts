import pool from '../config/database';

export interface LinkedAccount {
    id: number;
    user_id: number;
    linkedin_id: string;
    access_token: string;
    refresh_token?: string;
    token_expires_at?: Date;
    email: string;
    name: string;
    profile_picture?: string;
    is_primary: boolean;
    created_at: Date;
    updated_at: Date;
}

export class LinkedAccountModel {
    /**
     * Get all linked accounts for a user
     */
    static async findByUserId(userId: number): Promise<LinkedAccount[]> {
        const result = await pool.query(
            'SELECT * FROM linked_accounts WHERE user_id = $1 ORDER BY is_primary DESC, created_at ASC',
            [userId]
        );
        return result.rows;
    }

    /**
     * Get a specific linked account
     */
    static async findById(id: number, userId: number): Promise<LinkedAccount | null> {
        const result = await pool.query(
            'SELECT * FROM linked_accounts WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
        return result.rows[0] || null;
    }

    /**
     * Get linked account by LinkedIn ID
     */
    static async findByLinkedInId(linkedinId: string): Promise<LinkedAccount | null> {
        const result = await pool.query(
            'SELECT * FROM linked_accounts WHERE linkedin_id = $1',
            [linkedinId]
        );
        return result.rows[0] || null;
    }

    /**
     * Create a new linked account
     */
    static async create(data: {
        user_id: number;
        linkedin_id: string;
        access_token: string;
        refresh_token?: string;
        token_expires_at?: Date;
        email: string;
        name: string;
        profile_picture?: string;
        is_primary?: boolean;
    }): Promise<LinkedAccount> {
        const result = await pool.query(
            `INSERT INTO linked_accounts 
            (user_id, linkedin_id, access_token, refresh_token, token_expires_at, email, name, profile_picture, is_primary)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [
                data.user_id,
                data.linkedin_id,
                data.access_token,
                data.refresh_token || null,
                data.token_expires_at || null,
                data.email,
                data.name,
                data.profile_picture || null,
                data.is_primary || false
            ]
        );
        return result.rows[0];
    }

    /**
     * Update linked account tokens
     */
    static async updateTokens(
        id: number,
        accessToken: string,
        refreshToken?: string,
        expiresAt?: Date
    ): Promise<void> {
        await pool.query(
            `UPDATE linked_accounts 
            SET access_token = $1, refresh_token = $2, token_expires_at = $3, updated_at = NOW()
            WHERE id = $4`,
            [accessToken, refreshToken || null, expiresAt || null, id]
        );
    }

    /**
     * Delete a linked account
     */
    static async delete(id: number, userId: number): Promise<boolean> {
        // Don't allow deleting primary account
        const account = await this.findById(id, userId);
        if (!account) return false;
        if (account.is_primary) {
            throw new Error('Cannot delete primary linked account');
        }

        const result = await pool.query(
            'DELETE FROM linked_accounts WHERE id = $1 AND user_id = $2 AND is_primary = false',
            [id, userId]
        );
        return (result.rowCount || 0) > 0;
    }

    /**
     * Count linked accounts for a user
     */
    static async countByUserId(userId: number): Promise<number> {
        const result = await pool.query(
            'SELECT COUNT(*) as count FROM linked_accounts WHERE user_id = $1',
            [userId]
        );
        return parseInt(result.rows[0].count);
    }

    /**
     * Get primary account for a user
     */
    static async getPrimaryAccount(userId: number): Promise<LinkedAccount | null> {
        const result = await pool.query(
            'SELECT * FROM linked_accounts WHERE user_id = $1 AND is_primary = true',
            [userId]
        );
        return result.rows[0] || null;
    }
}
