// Profile.js
import React, { useState, useEffect } from 'react';
import Navbar from "../components/navbar";
import { auth, database } from '../config';
import { Container, Card, Row, Col, Image, Spinner, Alert } from 'react-bootstrap';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

export default function Profile() {
  const [userData, setUserData] = useState({
    email: '',
    highscore: 0,
    displayName: '',
    photoURL: '',
  });
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Reference to the user's profile using their UID
          const userRef = ref(database, `My-Profile/${user.uid}`);
          
          // Fetch the user's profile data
          const snapshot = await get(userRef);
          
          if (snapshot.exists()) {
            const userInfo = snapshot.val();
            setUserData({
              email: user.email,
              highscore: userInfo.highscore || 0,
              displayName: user.displayName || 'User',
              photoURL: user.photoURL || 'https://via.placeholder.com/150', // Placeholder image
            });
          } else {
            // Handle case where user profile doesn't exist
            setUserData({
              email: user.email,
              highscore: 0,
              displayName: user.displayName || 'User',
              photoURL: user.photoURL || 'https://via.placeholder.com/150',
            });
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to load user data.");
        } finally {
          setLoading(false);
        }
      } else {
        // No user is signed in
        setLoading(false);
        setError("No user is signed in.");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div style={{
        background: "linear-gradient(to bottom, #ffcccc, #ffffff)",
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading...</span>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div style={{
        background: "linear-gradient(to bottom, #ffcccc, #ffffff)",
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  // Profile Display
  return (
    <div style={{ background: "linear-gradient(to bottom, #ffcccc, #ffffff)", color: 'white', minHeight: '100vh' }}>
      <Navbar />
      <Container className="d-flex justify-content-center align-items-center py-5">
        <Card style={{ 
          width: '100%', 
          maxWidth: '600px', 
          backgroundColor: 'rgba(0, 0, 0, 0.7)', 
          color: 'white', 
          border: 'none', 
          borderRadius: '15px', 
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' 
        }}>
          <Card.Body>
            <Row className="mb-4">
              <Col xs={12} className="text-center">
                <Image 
                  src={userData.photoURL} 
                  roundedCircle 
                  width={150} 
                  height={150} 
                  alt="User Avatar" 
                  className="mb-3" 
                />
                <h3>{userData.displayName}</h3>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card.Text>
                  <strong>Email:</strong> {userData.email}
                </Card.Text>
              </Col>
            </Row>
            
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
