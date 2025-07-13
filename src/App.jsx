import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';
import CreatePost from './pages/CreatePost';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar /> {/* Shows on every page */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
