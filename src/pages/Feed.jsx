import React, { useEffect, useState } from 'react';
import axios from 'axios';

import QuickPostForm from '../components/QuickPostForm'; // ✅ Corrected path

const Feed = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [error, setError] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to fetch posts");
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch (err) {
      console.error("Like Error:", err);
    }
  };

  const handleCommentChange = (postId, value) => {
    setComments(prev => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = async (postId) => {
    const text = comments[postId];
    if (!text || !text.trim()) return;

    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/posts/${postId}/comment`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(prev => ({ ...prev, [postId]: "" }));
      fetchPosts();
    } catch (err) {
      console.error("Comment Error:", err);
    }
  };

  const handleDeleteComment = async (postId, index) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/posts/${postId}/comment/delete`,
        { index },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(prev => ({ ...prev, [postId]: '' }));
      fetchPosts();
    } catch (err) {
      console.error("Delete Comment Error:", err);
    }
  };

  const handleEditClick = (post) => {
    setEditingPostId(post._id);
    setEditedContent(post.content);
  };

  const handleUpdatePost = async (postId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/posts/${postId}/edit`,
        { content: editedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingPostId(null);
      setEditedContent('');
      fetchPosts();
    } catch (err) {
      console.error("Edit Post Error:", err);
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch (err) {
      console.error("Delete Post Error:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">LoopTalk Feed</h1>

      {/* ✅ Show QuickPostForm (Preview + image + text) */}
      <QuickPostForm onPostCreated={fetchPosts} />

      {/* ✅ Optional: Keep full PostForm if needed */}
      {/* <PostForm userId={userId} /> */}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Recent Posts</h2>
        {error && <p className="text-red-500">{error}</p>}

        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map(post => (
            <div key={post._id} className="bg-gray-100 p-4 rounded mb-4">
              <p className="font-semibold">@{post.userId?.username || "Unknown"}</p>

              {editingPostId === post._id ? (
                <>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="border w-full p-2 rounded"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleUpdatePost(post._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setEditingPostId(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <p className="mt-1">{post.content}</p>
              )}

              {post.image && (
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}${post.image}`}
                  alt="Post"
                  className="mt-2 rounded"
                />
              )}

              <p className="text-sm text-gray-500 mt-2">
                {new Date(post.createdAt).toLocaleString()}
              </p>

              <div className="flex items-center mt-2">
                <button
                  onClick={() => handleLike(post._id)}
                  className="text-blue-500 mr-2"
                >
                  ❤️ Like ({post.likes?.length || 0})
                </button>
              </div>

              {post.userId?._id === userId && (
                <div className="mt-2 flex gap-4 text-sm">
                  <button
                    onClick={() => handleEditClick(post)}
                    className="text-yellow-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}

              <div className="mt-3">
                <h4 className="text-sm font-semibold">Comments:</h4>
                {post.comments.map((comment, idx) => (
                  <p key={idx} className="text-sm">
                    <strong>@{comment.userId?.username || "User"}:</strong> {comment.text}
                    {comment.userId?._id === userId && (
                      <button
                        onClick={() => handleDeleteComment(post._id, idx)}
                        className="text-xs text-red-500 hover:underline ml-2"
                      >
                        Delete
                      </button>
                    )}
                  </p>
                ))}

                <div className="mt-2 flex">
                  <input
                    type="text"
                    value={comments[post._id] || ''}
                    onChange={(e) => handleCommentChange(post._id, e.target.value)}
                    placeholder="Write a comment..."
                    className="border p-1 flex-grow rounded-l"
                  />
                  <button
                    onClick={() => handleCommentSubmit(post._id)}
                    className="bg-blue-500 text-white px-3 rounded-r"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
