const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/api/posts' && req.method === 'GET') {
        try {
            const postsDir = path.join(process.cwd(), "src/posts");
            const draftsDir = path.join(process.cwd(), "src/drafts");

            const readPosts = (dir, isDraft) => {
                if (!fs.existsSync(dir)) return [];
                return fs.readdirSync(dir)
                    .filter(file => file.endsWith(".md"))
                    .map(file => {
                        const content = fs.readFileSync(path.join(dir, file), "utf8");
                        const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
                        if (!match) return null;

                        const frontmatter = {};
                        match[1].split("\n").forEach(line => {
                            const colonIndex = line.indexOf(":");
                            if (colonIndex > 0) {
                                const key = line.substring(0, colonIndex).trim();
                                let value = line.substring(colonIndex + 1).trim();
                                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                                    value = value.slice(1, -1);
                                }
                                if (key === "tags" && value.startsWith("[") && value.endsWith("]")) {
                                    value = value.slice(1, -1).split(",").map(t => t.trim().replace(/['"]/g, ""));
                                }
                                frontmatter[key] = value;
                            }
                        });

                        return {
                            id: file,
                            ...frontmatter,
                            content: match[2].trim(),
                            draft: isDraft
                        };
                    })
                    .filter(p => p !== null);
            };

            const allPosts = [...readPosts(postsDir, false), ...readPosts(draftsDir, true)];
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(allPosts));
        } catch (error) {
            console.error(error);
            res.writeHead(500);
            res.end(JSON.stringify({ error: error.message }));
        }
        return;
    }

    if (req.url === '/api/posts' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const post = JSON.parse(body);

                const frontmatter = {
                    layout: post.layout,
                    title: post.title,
                    author: post.author,
                    date: post.date,
                    tags: post.tags,
                    excerpt: post.excerpt,
                    heroImageUrl: post.heroImageUrl,
                    draft: post.draft
                };

                let fileContent = "---\n";
                Object.entries(frontmatter).forEach(([key, value]) => {
                    if (value === undefined || value === null || value === "") return;
                    if (Array.isArray(value)) {
                        fileContent += `${key}:\n`;
                        value.forEach(item => fileContent += `  - ${item}\n`);
                    } else {
                        fileContent += `${key}: ${typeof value === "string" ? `"${value}"` : value}\n`;
                    }
                });
                fileContent += "---\n\n" + post.content;

                const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
                const dateStr = new Date(post.date).toISOString().split("T")[0];
                const filename = `${dateStr}-${slug}.md`;
                const dir = post.draft ? "src/drafts" : "src/posts";
                const filePath = path.join(process.cwd(), dir, filename);

                if (!fs.existsSync(path.join(process.cwd(), dir))) {
                    fs.mkdirSync(path.join(process.cwd(), dir), { recursive: true });
                }

                if (post.id && post.id !== filename) {
                    const oldPathPosts = path.join(process.cwd(), "src/posts", post.id);
                    const oldPathDrafts = path.join(process.cwd(), "src/drafts", post.id);
                    if (fs.existsSync(oldPathPosts)) fs.unlinkSync(oldPathPosts);
                    if (fs.existsSync(oldPathDrafts)) fs.unlinkSync(oldPathDrafts);
                }

                fs.writeFileSync(filePath, fileContent);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, filename: filename }));
            } catch (error) {
                console.error(error);
                res.writeHead(500);
                res.end(JSON.stringify({ error: error.message }));
            }
        });
        return;
    }

    res.writeHead(404);
    res.end("Not Found");
});

server.listen(PORT, () => {
    console.log(`Local API server running on http://localhost:${PORT}`);
});
