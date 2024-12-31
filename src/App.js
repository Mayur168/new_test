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
import About from './components/About'; // Import the About component
import Contact from './components/Contact'; // Import the Contact component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Check if a token exists to set the authentication state
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
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
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route 
          path="/camera" 
          element={<PrivateRoute element={<CameraCapture />} />} 
        />
       <Route path="/about" element={<PrivateRoute element={<About />} />} /> 
        <Route path="/contact" element={<PrivateRoute element={<Contact />} />} /> 
      </Routes>
      <Footer />
    </div>
  );
}

export default App;