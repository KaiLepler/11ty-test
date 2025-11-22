// Blog Admin JavaScript
class BlogAdmin {
    constructor() {
        this.currentPost = null;
        this.posts = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadPosts();
        this.showPostList();
    }

    bindEvents() {
        // Navigation
        document.getElementById('new-post-btn').addEventListener('click', () => this.showNewPost());
        document.getElementById('import-post-btn').addEventListener('click', () => this.importMarkdown());
        document.getElementById('back-to-list').addEventListener('click', () => this.showPostList());

        // Form actions
        document.getElementById('save-post').addEventListener('click', () => this.savePost());
        document.getElementById('delete-post').addEventListener('click', () => this.deletePost());

        // Auto-generate slug from title
        document.getElementById('post-title').addEventListener('input', (e) => {
            this.updateSlugPreview(e.target.value);
        });

        // Handle file upload simulation
        document.getElementById('post-hero-upload').addEventListener('change', (e) => this.handleImageUpload(e));

        // Live Preview Listeners
        const previewInputs = ['post-title', 'post-content', 'post-hero-image', 'post-author', 'post-date'];
        previewInputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', () => this.updatePreview());
            }
        });
    }

    showPostList() {
        document.getElementById('post-list-view').classList.add('active');
        document.getElementById('post-editor-view').classList.remove('active');
        this.loadPosts();
    }

    showNewPost() {
        this.currentPost = null;
        this.clearForm();
        this.setDefaultValues();
        document.getElementById('post-list-view').classList.remove('active');
        document.getElementById('post-editor-view').classList.add('active');
        document.getElementById('delete-post').style.display = 'none';
    }

    showEditPost(post) {
        this.currentPost = post;
        this.populateForm(post);
        document.getElementById('post-list-view').classList.remove('active');
        document.getElementById('post-editor-view').classList.add('active');
        document.getElementById('post-editor-view').classList.add('active');
        document.getElementById('delete-post').style.display = 'inline-block';
        this.updatePreview();
    }

    clearForm() {
        document.getElementById('post-form').reset();
    }

    setDefaultValues() {
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString().slice(0, 16);

        document.getElementById('post-date').value = localDateTime;
        document.getElementById('post-layout').value = 'post.njk';
        document.getElementById('post-status').value = 'draft';
    }

    populateForm(post) {
        document.getElementById('post-title').value = post.title || '';
        document.getElementById('post-author').value = post.author || '';
        document.getElementById('post-layout').value = post.layout || 'post.njk';
        document.getElementById('post-tags').value = post.tags ? post.tags.join(', ') : '';
        document.getElementById('post-excerpt').value = post.excerpt || '';
        document.getElementById('post-excerpt').value = post.excerpt || '';
        document.getElementById('post-content').value = post.content || '';
        document.getElementById('post-hero-image').value = post.heroImageUrl || '';
        document.getElementById('post-status').value = post.draft ? 'draft' : 'published';

        if (post.date) {
            const date = new Date(post.date);
            const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                .toISOString().slice(0, 16);
            document.getElementById('post-date').value = localDateTime;
        }
    }

    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    updateSlugPreview(title) {
        const slug = this.generateSlug(title);
        // You could add a slug preview element here if desired
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const filename = file.name;
            const imagePath = `/images/${filename}`;

            // Auto-fill the URL field
            document.getElementById('post-hero-image').value = imagePath;

            // Show instructions
            const instructions = `Image path set to "${imagePath}".\n\nPlease move your image file to the "src/images/" directory.\n\nQuick command:\nmv ~/Downloads/${filename} src/images/`;

            setTimeout(() => {
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(`mv ~/Downloads/${filename} src/images/`).then(() => {
                        alert(instructions + '\n\n(Command copied to clipboard!)');
                    });
                } else {
                    alert(instructions);
                }
            }, 100);
        }
    }

    async loadPosts() {
        try {
            // In a real implementation, this would fetch from your backend
            // For now, we'll simulate with localStorage
            const savedPosts = localStorage.getItem('blogPosts');
            this.posts = savedPosts ? JSON.parse(savedPosts) : this.getSamplePosts();

            this.renderPostList();
        } catch (error) {
            console.error('Error loading posts:', error);
            this.posts = this.getSamplePosts();
            this.renderPostList();
        }
    }

    getSamplePosts() {
        return [
            {
                id: '1',
                title: 'Welcome to My Blog',
                date: new Date('2024-01-15'),
                layout: 'post.njk',
                tags: ['welcome', 'introduction'],
                excerpt: 'This is my first blog post where I introduce myself and my goals.',
                content: '# Welcome!\n\nThis is my first blog post. I\'m excited to share my thoughts and experiences with you.',
                draft: false
            },
            {
                id: '2',
                title: 'Learning Eleventy',
                date: new Date('2024-01-20'),
                layout: 'post.njk',
                tags: ['eleventy', 'web-development'],
                excerpt: 'My journey learning the Eleventy static site generator.',
                content: '# Learning Eleventy\n\nEleventy is an amazing static site generator...',
                draft: true
            }
        ];
    }

    renderPostList() {
        const publishedContainer = document.getElementById('published-posts');
        const draftContainer = document.getElementById('draft-posts');

        publishedContainer.innerHTML = '';
        draftContainer.innerHTML = '';

        const publishedPosts = this.posts.filter(post => !post.draft);
        const draftPosts = this.posts.filter(post => post.draft);

        if (publishedPosts.length === 0) {
            publishedContainer.innerHTML = '<div class="empty-state">No published posts yet</div>';
        } else {
            publishedPosts.forEach(post => {
                publishedContainer.appendChild(this.createPostItem(post));
            });
        }

        if (draftPosts.length === 0) {
            draftContainer.innerHTML = '<div class="empty-state">No draft posts</div>';
        } else {
            draftPosts.forEach(post => {
                draftContainer.appendChild(this.createPostItem(post));
            });
        }
    }

    createPostItem(post) {
        const item = document.createElement('div');
        item.className = 'post-item';
        item.addEventListener('click', () => this.showEditPost(post));

        const date = new Date(post.date).toLocaleDateString();
        const tagsText = post.tags ? post.tags.join(', ') : 'No tags';

        item.innerHTML = `
            <h3>${post.title}</h3>
            <div class="post-meta">
                ${date} • Layout: ${post.layout} • Tags: ${tagsText}
            </div>
            <div class="post-excerpt">${post.excerpt || 'No excerpt available'}</div>
        `;

        return item;
    }

    async savePost() {
        const formData = new FormData(document.getElementById('post-form'));
        const postData = {
            id: this.currentPost?.id || Date.now().toString(),
            title: formData.get('title'),
            author: formData.get('author'),
            date: new Date(formData.get('date')),
            layout: formData.get('layout'),
            tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
            excerpt: formData.get('excerpt'),
            excerpt: formData.get('excerpt'),
            content: formData.get('content'),
            heroImageUrl: formData.get('heroImageUrl'),
            draft: formData.get('status') === 'draft'
        };

        if (!postData.title.trim()) {
            alert('Please enter a title for the post');
            return;
        }

        try {
            if (this.currentPost) {
                // Update existing post
                const index = this.posts.findIndex(p => p.id === this.currentPost.id);
                if (index !== -1) {
                    this.posts[index] = postData;
                }
            } else {
                // Add new post
                this.posts.push(postData);
            }

            // Save to localStorage (in real app, this would be an API call)
            localStorage.setItem('blogPosts', JSON.stringify(this.posts));

            // Generate markdown file content
            const markdownContent = this.generateMarkdownFile(postData);
            this.downloadMarkdownFile(postData, markdownContent);

            alert('Post saved successfully! The markdown file has been downloaded.');
            this.showPostList();
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Error saving post. Please try again.');
        }
    }

    generateMarkdownFile(post) {
        const frontmatter = {
            layout: post.layout,
            title: post.title,
            author: post.author,
            date: post.date.toISOString(),
            tags: post.tags
        };

        if (post.excerpt) {
            frontmatter.excerpt = post.excerpt;
        }

        if (post.heroImageUrl) {
            frontmatter.heroImageUrl = post.heroImageUrl;
        }

        if (post.draft) {
            frontmatter.draft = true;
        }

        let content = '---\n';
        Object.entries(frontmatter).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                content += `${key}:\n`;
                value.forEach(item => {
                    content += `  - ${item}\n`;
                });
            } else if (typeof value === 'boolean') {
                content += `${key}: ${value}\n`;
            } else {
                content += `${key}: "${value}"\n`;
            }
        });
        content += '---\n\n';
        content += post.content;

        return content;
    }

    downloadMarkdownFile(post, content) {
        const slug = this.generateSlug(post.title);
        const date = post.date.toISOString().split('T')[0];
        const filename = `${date}-${slug}.md`;

        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Show instructions with copy-to-clipboard functionality
        const folder = post.draft ? 'src/drafts' : 'src/posts';
        const instructions = `File saved! Please move "${filename}" to the "${folder}" directory.\n\nQuick command:\nmv ~/Downloads/${filename} ${folder}/`;

        setTimeout(() => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(`mv ~/Downloads/${filename} ${folder}/`).then(() => {
                    alert(instructions + '\n\n(Command copied to clipboard!)');
                });
            } else {
                alert(instructions);
            }
        }, 500);
    }

    importMarkdown() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.md,.markdown';
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const content = e.target.result;
                        const post = this.parseMarkdownFile(content, file.name);
                        this.currentPost = null;
                        this.populateForm(post);
                        this.showEditPost(post);
                    } catch (error) {
                        alert('Error parsing markdown file: ' + error.message);
                    }
                };
                reader.readAsText(file);
            }
        });
        input.click();
    }

    parseMarkdownFile(content, filename) {
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);

        let frontmatter = {};
        let markdownContent = content;

        if (match) {
            const frontmatterText = match[1];
            markdownContent = match[2];

            // Simple YAML parsing (basic implementation)
            frontmatterText.split('\n').forEach(line => {
                const colonIndex = line.indexOf(':');
                if (colonIndex > 0) {
                    const key = line.substring(0, colonIndex).trim();
                    let value = line.substring(colonIndex + 1).trim();

                    // Remove quotes
                    if ((value.startsWith('"') && value.endsWith('"')) ||
                        (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1);
                    }

                    // Handle arrays (basic)
                    if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
                        value = value.slice(1, -1).split(',').map(tag => tag.trim().replace(/['"]/g, ''));
                    }

                    frontmatter[key] = value;
                }
            });
        }

        return {
            id: Date.now().toString(),
            title: frontmatter.title || filename.replace(/\.md$/, ''),
            author: frontmatter.author || '',
            date: frontmatter.date ? new Date(frontmatter.date) : new Date(),
            layout: frontmatter.layout || 'post.njk',
            tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
            tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
            excerpt: frontmatter.excerpt || '',
            heroImageUrl: frontmatter.heroImageUrl || '',
            content: markdownContent.trim(),
            draft: frontmatter.draft === true || frontmatter.draft === 'true'
        };
    }

    async deletePost() {
        if (!this.currentPost) return;

        if (confirm('Are you sure you want to delete this post?')) {
            this.posts = this.posts.filter(p => p.id !== this.currentPost.id);
            localStorage.setItem('blogPosts', JSON.stringify(this.posts));
            alert('Post deleted successfully!');
            this.showPostList();
        }
    }
}

// Initialize the admin when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BlogAdmin();
});