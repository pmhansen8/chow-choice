import React, { useState, useContext, useEffect } from 'react';
import { NavLink as Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from '../components/navbar';
import { UserContext } from '../components/UserContext';
import { auth, database } from '../config'; 
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import {
  ref,
  set,
  get
} from 'firebase/database';

export default function SignUp() {
  const context = useContext(UserContext);
  const navigate = useNavigate(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

     
      await updateProfile(user, { displayName: 'User' }); // Replace 'User' with dynamic input if available

      await handleUserSignIn(user);
    } catch (error) {
      let errorMessage = 'An error occurred during sign up.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'The email address is not valid.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'The password is too weak.';
      }
      toast(errorMessage, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleUserSignIn = async (user) => {
    try {
      const userRef = ref(database, `My-Profile/${user.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        toast(`Welcome back ${user.displayName || user.email}`, { type: "success" });
      } else {
        await set(userRef, {
          email: user.email,
          userUid: user.uid,
          highscore: 0
        });
        toast(`Welcome ${user.displayName || user.email}`, { type: "success" });
      }

      context.setUser({ email: user.email, uid: user.uid });
      
      
      setTimeout(() => {
        navigate('/home'); 
      }, 2000); 
    } catch (error) {
      toast("An error occurred while setting up your profile.", { type: "error" });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        context.setUser({ email: user.email, uid: user.uid });
        navigate('/home'); // Redirect if user is already authenticated
      }
    });

    return () => unsubscribe(); 
  }, [context, navigate]);

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
        <form onSubmit={handleSignUp} style={{ textAlign: 'center', color: 'white' }}>
          <h2>Sign Up</h2>
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
          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              padding: '10px 20px', 
              backgroundColor: 'blue', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px' 
            }}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
          <p>Already have an account? <Link to="/sign-in">Sign In</Link></p>
        </form>
      </div>
    </div>
  );
}
