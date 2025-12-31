// Import articles 4-10 from extracted PDFs
import fs from 'fs';

const API_URL = 'https://shaly-backend.onrender.com';

// Read extracted articles
const rawData = fs.readFileSync('scripts/extracted_articles.json', 'utf8');
const extractedArticles = JSON.parse(rawData);

// Function to generate SEO-friendly slug
function generateSlug(title) {
    return title
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Prepare articles for import
const articlesToImport = extractedArticles.map(article => {
    const slug = generateSlug(article.title);

    // Use raw content as markdown
    const content = `# ${article.title}\n\n${article.full_content}\n\n---\n\n## 💡 Vous voulez publier sur LinkedIn sans stress ?\n\n[Shaly](/) vous permet de planifier vos posts LinkedIn simplement et efficacement.`;

    // Extract excerpt from first lines
    const lines = article.full_content.split('\n').filter(l => l.trim().length > 30);
    const excerpt = (lines[2] || lines[1] || lines[0] || '').substring(0, 180) + '...';

    return {
        title: article.title,
        slug: slug,
        excerpt: excerpt,
        content: content,
        author: "Équipe Shaly",
        published: true,
        published_at: article.publication_date
    };
});

// Import articles
async function importArticles() {
    console.log(`\n🚀 Importing ${articlesToImport.length} articles...\n`);

    for (const article of articlesToImport) {
        try {
            console.log(`Importing: ${article.title.substring(0, 60)}...`);

            const response = await fetch(`${API_URL}/setup/import-article`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(article)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                console.log(`✅ ID: ${data.post.id} | Published: ${new Date(data.post.published_at).toLocaleDateString('fr-CH')}`);
            } else {
                console.error(`❌ Error: ${data.error}`);
            }
        } catch (error) {
            console.error(`❌ Failed: ${error.message}`);
        }
    }

    console.log('\n✅ All articles imported!\n');
}

importArticles();
