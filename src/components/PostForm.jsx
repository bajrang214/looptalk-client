import React, { useState } from 'react';
import axios from 'axios';

const PostForm = ({ userId }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage("\u274C No token found. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append('content', content);
    if (image) formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/posts', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage("\u2705 Post created successfully");
      setContent('');
      setImage(null);
    } catch (err) {
      console.error("Post Error:", err.response?.data || err.message);
      setMessage("\u274C Failed to create post");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Create a Post</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded resize-none"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Post</button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default PostForm;