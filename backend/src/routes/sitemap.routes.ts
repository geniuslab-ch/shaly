import { Router, Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

/**
 * GET /sitemap.xml
 * Generate dynamic sitemap with all public pages including blog articles
 */
router.get('/sitemap.xml', async (req: Request, res: Response) => {
    try {
        // Fetch all blog articles
        const articlesResult = await pool.query(
            `SELECT slug, updated_at, created_at FROM blog_articles 
             WHERE published = true 
             ORDER BY created_at DESC`
        );

        const articles = articlesResult.rows;

        // Build sitemap XML
        const baseUrl = 'https://shaly.ch';
        const now = new Date().toISOString().split('T')[0];

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    
    <!-- Landing Page -->
    <url>
        <loc>${baseUrl}/</loc>
        <lastmod>${now}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    
    <!-- Blog -->
    <url>
        <loc>${baseUrl}/blog</loc>
        <lastmod>${now}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    
    <!-- Blog Articles (Dynamic) -->`;

        // Add each blog article
        articles.forEach((article: any) => {
            const lastmod = article.updated_at || article.created_at;
            const formattedDate = new Date(lastmod).toISOString().split('T')[0];

            xml += `
    <url>
        <loc>${baseUrl}/blog/${article.slug}</loc>
        <lastmod>${formattedDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>`;
        });

        // Add legal pages
        xml += `
    
    <!-- Legal Pages -->
    <url>
        <loc>${baseUrl}/legal/mentions</loc>
        <lastmod>${now}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>
    
    <url>
        <loc>${baseUrl}/legal/terms</loc>
        <lastmod>${now}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>
    
    <url>
        <loc>${baseUrl}/legal/privacy</loc>
        <lastmod>${now}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>
    
</urlset>`;

        // Set proper headers
        res.header('Content-Type', 'application/xml');
        res.header('Cache-Control', 'public, max-age=3600'); // Cache 1 hour
        res.send(xml);

    } catch (error) {
        console.error('Error generating sitemap:', error);
        res.status(500).send('Error generating sitemap');
    }
});

export default router;
