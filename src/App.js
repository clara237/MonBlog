import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/protectedroute/Protectedroute';
import Topbar from './components/topbar/Topbar';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Write from './pages/write/Write';
import SinglePost from './pages/singlePost/SinglePost';
import AdminRoute from './components/adminRoute/AdminRoute';
import AdminDashboard from './pages/adminDashboard/AdminDashboard';
import Post from './components/posts/Post';
import Footer from './components/footer/Footer';

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Topbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/posts" element={<Post />} /> 
        <Route path="/post/:id" element={<SinglePost />} />
        <Route 
          path="/write" 
          element={
            <ProtectedRoute>
              <Write />
            </ProtectedRoute>
          } 
        />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;