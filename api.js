// API URL
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Function to fetch all posts
async function fetchPosts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const posts = await response.json();
        return posts;
    } catch (error) {
        console.error('Error fetching posts:', error);
        // check storage for posts
        const storedPosts = localStorage.getItem('posts');
        if (storedPosts) {
            return JSON.parse(storedPosts);
        }
        return [];
    }
}

// Function to fetch a single post
async function fetchPost(id) {
    try {
        if (!id) {
            throw new Error('Post ID is required');
        }
        
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            if (response.status === 404) {
                console.error('Post not found');
                return null;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const post = await response.json();
        return post;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

// Function to create a new post
async function createPost(postData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const post = await response.json();
        return post;
    } catch (error) {
        console.error('Error creating post:', error);
        return null;
    }
}

// Export the API functions
export {
    fetchPosts,
    fetchPost,
    createPost
}; 