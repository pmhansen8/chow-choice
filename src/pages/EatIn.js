// EatIn.js
import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import RecipeCard from '../components/RecipeCard';
import { generateEatIn } from '../components/OpenAiController';
import { ref, set, get } from 'firebase/database';
import { auth, database } from '../config';
import { UserContext } from '../components/UserContext';
import { NavLink as Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { onAuthStateChanged } from 'firebase/auth';

export default function EatIn() {
  const [foodInputs, setFoodInputs] = useState(['']);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Error state
  const [success, setSuccess] = useState(null); // Success state for saving recipes
  const [user, setUser] = useState(null); 
  const [restaurants, setRestaurants] = useState([])
  const context = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log('User:', currentUser);
        setUser(currentUser);
      } else {
        console.error('No user is signed in.');
        setUser(null);
        setRestaurants([]);
        setRecipes([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (index, event) => {
    const values = [...foodInputs];
    values[index] = event.target.value;
    setFoodInputs(values);
  };

  const handleAddInput = () => {
    const allFilled = foodInputs.every((input) => input.trim() !== '');
    if (allFilled) {
      setFoodInputs([...foodInputs, '']);
    } else {
      setError('Please fill in all ingredient fields before adding a new one.');
    }
  };

  const handleRemoveInput = (index) => {
    const values = [...foodInputs];
    values.splice(index, 1);
    setFoodInputs(values);
  };

  const handleRecipeClick = (recipe) => {
    alert('Recipe clicked:\n' + recipe);
  };

  // Function to save a recipe to Firebase
  const handleSaveRecipe = async (recipe) => {
    try {
      const userRef = ref(database, `My-Profile/${user.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userInfo = snapshot.val();
        const savedRecipes = userInfo.savedRecipes || [];
        savedRecipes.push(recipe);
        await set(userRef, { ...userInfo, savedRecipes });
        setSuccess('Recipe saved successfully!');
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
      
    }
  };

  // Handle form submission
  const Submit = async (e) => {
    e.preventDefault();

    const allFilled = foodInputs.every((input) => input.trim() !== '');
    if (!allFilled) {
      setError('Please fill in all ingredient fields before submitting.');
      return;
    }

    setRecipes([]);
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const generatedRecipes = await generateEatIn(foodInputs);

      const splitRecipes = generatedRecipes
        .split('###')
        .map((recipe) => recipe.trim())
        .filter((recipe) => recipe !== '');
      setRecipes(splitRecipes);
      if (splitRecipes.length === 0) {
        setError('No recipes were generated. Please try different ingredients.');
      }
      console.log('Generated Recipes:', splitRecipes);
    } catch (error) {
      console.error('Error generating recipes:', error);
      setError('An error occurred while generating recipes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div
        style={{
          background: 'linear-gradient(to bottom, red, white)',
          color: 'white',
          minHeight: '100vh',
          overflow: 'hidden',
          paddingBottom: '3%',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <h1 style={{ color: 'white', fontSize: '3em', marginBottom: '20px' }}>
          What Ingredients Do You Have?
        </h1>

        {/* Display Error Alert */}
        {error && (
          <div style={styles.alert(error, 'danger')}>
            {error}
            <button onClick={() => setError(null)} style={styles.closeButton}>
              &times;
            </button>
          </div>
        )}

        {/* Display Success Alert */}
        {success && (
          <div style={styles.alert(success, 'success')}>
            {success}
            <button onClick={() => setSuccess(null)} style={styles.closeButton}>
              &times;
            </button>
          </div>
        )}

        {foodInputs.map((input, index) => (
          <div key={index} style={styles.inputContainer}>
            <input
              type="text"
              placeholder="Enter ingredient"
              value={input}
              onChange={(event) => handleInputChange(index, event)}
              style={styles.input}
            />
            {foodInputs.length > 1 && (
              <button onClick={() => handleRemoveInput(index)} style={styles.removeButton}>
                Remove
              </button>
            )}
          </div>
        ))}

        <button onClick={handleAddInput} style={styles.addButton}>
          Add Another Ingredient
        </button>

        {/* Submit Button */}
        <button onClick={Submit} style={styles.submitButton}>
          {loading ? 'Generating...' : 'Submit'}
        </button>

        {/* Loading Spinner */}
        {loading && <div style={styles.spinner} />}

        {/* Display the recipes */}
        <div style={styles.recipesContainer}>
          {recipes.slice(1).length > 0 ? (
            recipes.slice(1).map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe} handleSaveRecipe={handleSaveRecipe} />
            ))
          ) : (
            <p>No recipes to display.</p>
          )}
        </div>
      </div>
      {/* Inline CSS for loading animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
}

const styles = {
  alert: (message, type) => ({
    backgroundColor: type === 'danger' ? '#dc3545' : '#28a745',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    marginBottom: '20px',
    width: '300px',
    position: 'relative',
  }),
  closeButton: {
    position: 'absolute',
    top: '5px',
    right: '10px',
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  inputContainer: {
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    padding: '10px',
    width: '300px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginRight: '10px',
    outline: 'none',
  },
  removeButton: {
    padding: '10px 15px',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  addButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  submitButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: 'blue',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  spinner: {
    marginTop: '20px',
    border: '8px solid #f3f3f3', // Light grey background
    borderTop: '8px solid #4caf50', // Green color for the spinning part
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    animation: 'spin 2s linear infinite',
    margin: 'auto',
  },
  recipesContainer: {
    marginTop: '30px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
};
