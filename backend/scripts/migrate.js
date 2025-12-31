const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
    // Connection string from Render (Internal URL)
    const connectionString = 'postgresql://shaly:UT3Quc2f2swY1Z70p5XOAtsaISHqlsrv@dpg-d5a86su3jp1c73cfqnvg-a/shaly_515s';

    const client = new Client({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('🔗 Connecting to database...');
        await client.connect();
        console.log('✅ Connected!');

        // Read SQL file
        const sqlPath = path.join(__dirname, '../database/schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('📊 Running migrations...');
        await client.query(sql);
        console.log('✅ Migrations completed successfully!');

        // Verify tables exist
        const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

        console.log('\n📋 Tables created:');
        result.rows.forEach(row => {
            console.log(`  - ${row.table_name}`);
        });

    } catch (error) {
        console.error('❌ Migration error:', error.message);
        process.exit(1);
    } finally {
        await client.end();
        console.log('\n🎉 Migration complete!');
    }
}

runMigrations();
