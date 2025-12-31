import express from 'express';
import pool from '../config/database';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// TEMPORARY - Remove after running once!
router.get('/setup-database', async (req, res) => {
    try {
        // Read schema SQL
        const schemaPath = path.join(__dirname, '../../database/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Execute schema
        await pool.query(schema);

        res.json({
            success: true,
            message: 'Database tables created successfully!'
        });
    } catch (error: any) {
        console.error('Database setup error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;
