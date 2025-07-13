import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';






const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [myPosts, setMyPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  

  // ✅ Fetch profile details
  const fetchProfile = useCallback(async () => {
  const token = localStorage.getItem('token');
  if (!token) return; // ⛔ don't make request if no token

  try {
    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProfile(res.data);
    setBio(res.data.bio || '');
    setPreview(`${process.env.REACT_APP_API_BASE_URL}${res.data.profileImage}`);
  } catch (err) {
    console.error('Fetch profile error:', err);
  }
}, []);


  // ✅ Fetch posts by this user
  const fetchMyPosts = useCallback(async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user/me/posts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setMyPosts(res.data);
  } catch (err) {
    console.error('Fetch my posts error:', err);
  }
}, []);


  // ✅ Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('bio', bio);
    if (image) {
      formData.append('profileImage', image);
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/user/me`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('✅ Profile updated');
      setProfile(res.data);
      setPreview(`${process.env.REACT_APP_API_BASE_URL}${res.data.profileImage}`);
    } catch (err) {
      console.error('Update profile error:', err);
      setMessage('❌ Failed to update profile');
    }
  };

  // ✅ Update a post
  const handleUpdatePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/posts/${postId}/edit`, {
        content: editedContent
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingPostId(null);
      fetchMyPosts();
    } catch (err) {
      console.error('Update post error:', err);
    }
  };

  // ✅ Delete a post
  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMyPosts();
    } catch (err) {
      console.error('Delete post error:', err);
    }
  };

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login'; // or use `navigate('/login')` if using React Router
    return;
  }

  fetchProfile();
  fetchMyPosts();
}, [fetchProfile, fetchMyPosts]);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Profile</h2>

      {profile && (
        <div className="flex flex-col items-center gap-3">
          {preview && (
            <img
              src={preview}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
            />
          )}
          <p className="font-semibold">@{profile.username}</p>
        </div>
      )}

      <form onSubmit={handleUpdateProfile} className="mt-6 flex flex-col gap-4">
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Your bio..."
          className="border p-2 rounded resize-none"
          rows={3}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>

      {message && <p className="mt-4 text-center text-sm">{message}</p>}

      {/* My Posts Section */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-center">📌 My Posts</h3>
        {myPosts.length === 0 ? (
          <p className="text-center text-gray-500">You haven't posted anything yet.</p>
        ) : (
          myPosts.map((post) => (
            <div key={post._id} className="bg-gray-100 p-4 rounded mb-4">
              <p className="text-sm text-gray-600">@{post.userId?.username}</p>

              {/* Edit Mode */}
              {editingPostId === post._id ? (
                <>
                  <textarea
                    className="w-full p-2 border rounded"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleUpdatePost(post._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Save
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
                <>
                  <p className="mt-2">{post.content}</p>
                  {post.image && (
                    <img
                      src={`${process.env.REACT_APP_API_BASE_URL}${post.image}`}
                      alt="Post"
                      className="mt-2 w-full rounded"
                    />
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm mt-1">❤️ Likes: {post.likes.length}</p>

                  <div className="mt-2 flex gap-3">
                    <button
                      onClick={() => {
                        setEditingPostId(post._id);
                        setEditedContent(post.content);
                      }}
                      className="text-yellow-600 font-semibold"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="text-red-600 font-semibold"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </>
              )}

              {/* Comments */}
              <div className="mt-3">
                <h4 className="font-semibold text-sm">Comments:</h4>
                {post.comments.map((comment, idx) => (
                  <p key={idx} className="text-sm">
                    <strong>@{comment.userId?.username || 'User'}:</strong> {comment.text}
                  </p>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
