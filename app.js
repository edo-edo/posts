import { fetchPosts, fetchPost, createPost } from './api.js';
import store from './store.js';

// Function to render posts list
function renderPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;

    postsContainer.innerHTML = posts.map(post => `
        <div class="post-card">
            <h2>${post.title}</h2>
            <p>${post.body.substring(0, 100)}...</p>
            <a href="post.html?id=${post.id}">Read More</a>
        </div>
    `).join('');
}

// Function to render post detail
function renderPostDetail(post) {
    const postDetail = document.getElementById('post-detail');
    if (!postDetail) return;

    if (!post) {
        postDetail.innerHTML = `
            <a href="index.html" class="back-button">← Back to Posts</a>
            <h1>Post Not Found</h1>
            <p>Sorry, the post you're looking for doesn't exist, try again</p>
        `;
        return;
    }

    postDetail.innerHTML = `
        <a href="index.html" class="back-button">← Back to Posts</a>
        <h1>${post.title}</h1>
        <p>${post.body}</p>
    `;
}

// Function to handle create post form submission
function handleCreatePostForm() {
    const form = document.getElementById('create-post-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const body = document.getElementById('body').value;

        const postData = {
            title,
            body
        };

        // Add post to store
        const newPost = store.addPost(postData);
        
        // Also send to API (for demonstration)
        await createPost(postData);

        // Redirect to the new post's detail page
        window.location.href = `post.html?id=${newPost.id}`;
    });
}

// Function to fetch and display a post
async function fetchAndDisplayPost(postId) {
    console.log('Fetching post with ID:', postId);
    
    // First try to get from store
    let post = store.getPost(postId);
    console.log('Post from store:', post);
    
    // If not in store, try to fetch from API
    if (!post) {
        console.log('Post not found in store, fetching from API...');
        post = await fetchPost(postId);
        console.log('Post from API:', post);
        
        if (post) {
            // Add to store for future use
            store.addPost(post);
        }
    }
    
    return post;
}

// Function to initialize posts from API if needed
async function initializePosts() {
    let posts = store.getPosts();
    console.log('Posts from store:', posts);
    
    // If no posts in store, fetch from API
    if (posts.length === 0) {
        console.log('No posts in store, fetching from API...');
        posts = await fetchPosts();
        // Initialize store with fetched posts
        await store.initialize(posts);
    }
    
    return posts;
}

// Initialize the app
async function init() {
    // Check if we're on the post detail page
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (postId) {
        // We're on the post detail page
        const post = await fetchAndDisplayPost(postId);
        renderPostDetail(post);
    } else if (window.location.pathname.includes('create.html')) {
        // We're on the create post page
        handleCreatePostForm();
    } else {
        // We're on the main page
        const posts = await initializePosts();
        renderPosts(posts);
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', init); 
