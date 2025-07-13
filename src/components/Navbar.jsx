import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
      <Link to="/feed" className="text-xl font-bold">
        LoopTalk
      </Link>

      <div className="flex gap-4">
        <Link to="/create" className="hover:underline">
          Create Post
        </Link>
        <Link to="/profile" className="hover:underline">
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="hover:underline text-red-200 font-semibold"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
