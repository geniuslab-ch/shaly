// Debug script to see full error
const API_URL = 'https://shaly-backend.onrender.com';

const article = {
    title: "Test Article",
    slug: "test-article-" + Date.now(),
    excerpt: "Test excerpt",
    content: "# Test\n\nThis is a test article",
    author: "Équipe Shaly",
    published: false,
    published_at: new Date().toISOString()
};

async function testAdd() {
    try {
        console.log('Testing article creation...');
        console.log('URL:', `${API_URL}/api/blog/admin/posts`);

        const response = await fetch(`${API_URL}/api/blog/admin/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(article)
        });

        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);

        const text = await response.text();
        console.log('Response body:', text);

        try {
            const data = JSON.parse(text);
            console.log('Parsed JSON:', data);
        } catch (e) {
            console.log('Could not parse as JSON');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

testAdd();
