import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import { auth, database } from '../config'; 
import { ref, get } from 'firebase/database';

export default function SavedItems() {
    const [recipes, setRecipes] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = auth.currentUser;

    useEffect(() => {
        // If no user is logged in, reset state and exit
        if (!user) {
            console.log("No user is signed in.");
            setRestaurants([]);
            setRecipes([]);
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const userRef = ref(database, `My-Profile/${user.uid}`);
                const snapshot = await get(userRef);
          
                if (snapshot.exists()) {
                    const userInfo = snapshot.val();
                    setRestaurants(userInfo.savedRestaurants || []);
                    setRecipes(userInfo.savedRecipes || []);
                } else {
                    setRestaurants([]);
                    setRecipes([]);
                }
            } catch (error) {
                console.error("An error occurred while fetching your profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div style={styles.loadingContainer}>
                    <h2>Loading...</h2>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div style={styles.container}>
                <section style={styles.section}>
                    <h2 style={styles.heading}>Saved Restaurants</h2>
                    {restaurants.length > 0 ? (
                        <div style={styles.grid}>
                            {restaurants.map((restaurant, index) => (
                                <div key={index} style={styles.card}>
                                    <h3 style={styles.cardTitle}>{restaurant || `Restaurant ${index + 1}`}</h3>

                                    {/* Add more details as needed */}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No saved restaurants.</p>
                    )}
                </section>
                
                <section style={styles.section}>
                    <h2 style={styles.heading}>Saved Recipes</h2>
                    {recipes.length > 0 ? (
                        <div style={styles.grid}>
                            {recipes.map((recipe, index) => (
                                <div key={index} style={styles.card}>
                                    <h3 style={styles.cardTitle}>{recipe.name || `Recipe ${index + 1}`}</h3>
                                    <p style={styles.cardContent}>{recipe.description || 'No description available.'}</p>
                                    {/* Add more details as needed */}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No saved recipes.</p>
                    )}
                </section>
            </div>
        </>
    );
}

// Inline styles for simplicity
const styles = {
    loadingContainer: {
        width: "100%",
        height: '100vh',
        background: "linear-gradient(to bottom, red, white)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    container: {
        width: "100%",
        minHeight: '100vh',
        background: "linear-gradient(to bottom, #ffcccc, white)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    section: {
        width: "100%",
        maxWidth: "1200px",
        marginBottom: "40px",
    },
    heading: {
        textAlign: "center",
        marginBottom: "20px",
        color: "#333",
    },
    grid: {
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "center",
    },
    card: {
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        width: "280px",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
    },
    cardTitle: {
        margin: "0 0 10px 0",
        fontSize: "1.2em",
        color: "#ff4d4d",
    },
    cardContent: {
        margin: 0,
        color: "#555",
    },
};

// Optional: Add hover effects using JavaScript
// Note: Inline styles don't support pseudo-classes like :hover. To add hover effects,
// you might need to use CSS classes or a CSS-in-JS library like styled-components.
// Here's a basic example using React state to handle hover:

// Update the card rendering as follows:

/*
{restaurants.map((restaurant, index) => (
    <HoverCard key={index} title={restaurant.name || `Restaurant ${index + 1}`} description={restaurant.description || 'No description available.'} />
))}
*/

// And define a HoverCard component:

/*
import React, { useState } from 'react';

const HoverCard = ({ title, description }) => {
    const [isHovered, setIsHovered] = useState(false);

    const hoverStyle = isHovered
        ? { ...styles.card, transform: 'translateY(-5px)', boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)' }
        : styles.card;

    return (
        <div
            style={hoverStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <h3 style={styles.cardTitle}>{title}</h3>
            <p style={styles.cardContent}>{description}</p>
        </div>
    );
};
*/

