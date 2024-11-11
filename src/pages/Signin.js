import React, { useState, useContext, useEffect } from 'react';
import { Navigate, NavLink as Link } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from '../components/navbar';
import { UserContext } from '../components/UserContext';
import { auth } from '../config'; 
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';

export default function SignIn() {
  const { user, setUser } = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;
      toast(`Welcome back ${currentUser.email}`, { type: "success" });
      setUser({ email: currentUser.email, uid: currentUser.uid });
    } catch (error) {
      toast(error.message, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({ email: currentUser.email, uid: currentUser.uid });
      }
    });

    return () => unsubscribe(); 
  }, [setUser]);

 
    return (
      <div>
        <ToastContainer />
        <Navbar />
        <div style={{
          width: "100%",
          height: '100vh',
          background: "linear-gradient(to bottom, red, white)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <form onSubmit={handleSignIn} style={{ textAlign: 'center', color: 'white' }}>
            <h2>Sign In</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ margin: '10px', padding: '10px' }}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ margin: '10px', padding: '10px' }}
            />
            <br />
            <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            <p>Don't have an account? <Link to="/sign-up">Sign Up</Link></p>
          </form>
        </div>
      </div>
    );

}
