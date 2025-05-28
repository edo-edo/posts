// Store for managing application state
class Store {
    constructor() {
        this.posts = this.loadFromStorage();
        this.nextId = this.getNextId();
    }

    // Load posts from localStorage
    loadFromStorage() {
        const storedPosts = localStorage.getItem('posts');
        return storedPosts ? JSON.parse(storedPosts) : [];
    }

    // Save posts to localStorage
    saveToStorage() {
        localStorage.setItem('posts', JSON.stringify(this.posts));
    }

    // Get the next available ID
    getNextId() {
        const storedNextId = localStorage.getItem('nextId');
        return storedNextId ? Number(storedNextId) : 101;
    }

    // Save the next ID to localStorage
    saveNextId() {
        localStorage.setItem('nextId', this.nextId.toString());
    }

    // Get all posts
    getPosts() {
        return this.posts;
    }

    // Get a single post
    getPost(id) {
        // Convert both to numbers for comparison
        const postId = Number(id);
        console.log('Looking for post with ID:', postId, 'Current posts:', this.posts);
        return this.posts.find(post => Number(post.id) === postId);
    }

    // Add a new post
    addPost(post) {
        const newPost = {
            ...post,
            id: this.nextId++,
            userId: 1
        };
        this.posts.unshift(newPost); // Add to beginning of array
        console.log('Added new post:', newPost);
        
        // Save to localStorage
        this.saveToStorage();
        this.saveNextId();
        
        return newPost;
    }

    // Initialize store with posts from API
    async initialize(posts) {
        this.posts = posts;
        console.log('Store initialized with posts:', this.posts);
        
        // Save to localStorage
        this.saveToStorage();
    }

    // Clear all posts (useful for testing)
    clearPosts() {
        this.posts = [];
        this.nextId = 101;
        localStorage.removeItem('posts');
        localStorage.removeItem('nextId');
    }
}

// Create a single instance of the store
const store = new Store();

export default store; 