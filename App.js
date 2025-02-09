import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { auth } from "./config/firebase";  // Import auth from firebase
import { onAuthStateChanged } from "firebase/auth";  // Import directly from Firebase
import Auth from "./components/auth";
import Maps from "./pages/maps";
import Info from "./pages/info";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Show nothing while checking auth state
  if (loading) return null;

  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <nav className="navbar">
          <h1>MediSync</h1>
          <img src="logo512.png" alt="MediSync Logo" className="navbar-logo" />
          <div className="nav-links">
            <Link to="/signin" className="nav-button">Sign In</Link>
            <Link to="/info" className="nav-button">Ask AI</Link>
            <Link to="/maps" className="nav-button">Location</Link>
          </div>
       
        </nav>
        <h1>MediSync</h1>


        {/* Page Routes */}
        <Routes>
          <Route path="/signin" element={<Auth />} />  {/* Always accessible */}

          {/* Conditionally render Home and Location pages */}
          <Route
            path="/info"
            element={user ? <Info /> : <div></div>}  // Empty div when not logged in
          />
          <Route
            path="/maps"
            element={user ? <Maps /> : <div></div>}  // Empty div when not logged in
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

