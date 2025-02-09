import { useState, useEffect } from "react";
import { auth, googleProvider } from "../config/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import "../App.css";

export const Auth = () => {
  const [user, setUser] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      
      <h3>Welcome!! Learn more about your health!</h3>
      <br />

      {user ? (
        <>
        <div class="log"> 
          <h2>Welcome, {user.displayName}! Click on the other tabs to find more info!!</h2>
          </div>
          <br />
          <button className="Logout" onClick={logout}>
            Log Out
          </button>
        </>
      ) : (
        <button className="button" onClick={signInWithGoogle}>
          Sign In with Google
        </button>
      )}
    </div>
  );
};

export default Auth;
