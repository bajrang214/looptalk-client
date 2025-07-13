import React, { useState } from 'react';
import axios from 'axios';

const QuickPostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && !image) {
      setMessage("Please write something or select an image.");
      return;
    }

    const formData = new FormData();
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post('http://localhost:5000/api/posts', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setContent('');
      setImage(null);
      setPreview(null);
      setMessage('✅ Post created');
      if (onPostCreated) onPostCreated(); // refresh posts
    } catch (err) {
      console.error("Post error:", err);
      setMessage('❌ Failed to create post');
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-xl mx-auto mt-6">
      <h3 className="text-lg font-semibold mb-3">Create a Post</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="border p-2 rounded resize-none"
          rows={3}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border p-2 rounded"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-60 object-contain border rounded"
          />
        )}

        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Post
        </button>
        {message && <p className="text-sm text-center">{message}</p>}
      </form>
    </div>
  );
};

export default QuickPostForm;
