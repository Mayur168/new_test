import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Home from './components/Home';
import { useState, useEffect } from 'react';
import RefreshHandler from './components/RefreshHandler';
import CameraCapture from "./components/CameraCapture";
import About from './components/About'; 
import Contact from './components/Contact'; 

// Helper function to update authentication state
const updateAuthState = (setIsAuthenticated) => {
  const token = localStorage.getItem('accessToken');
  setIsAuthenticated(!!token); // Update authentication based on token existence
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    updateAuthState(setIsAuthenticated); // Check authentication state on app load
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('loggedInUser');
    setIsAuthenticated(false); // Update the authentication state
  };

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />

        {/* <Route 
          path="/home" 
          element={<PrivateRoute element={<Home />} />} 
        /> */}
        <Route 
          path="/camera" 
          element={<PrivateRoute element={<CameraCapture />} />} 
        />
        <Route 
          path="/about" 
          element={<PrivateRoute element={<About />} />} 
        />
        <Route 
          path="/contact" 
          element={<PrivateRoute element={<Contact />} />} 
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
