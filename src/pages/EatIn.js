// EatIn.js
import React, {useContext, useState } from 'react';
import Navbar from '../components/navbar';
import { generateEatIn } from '../components/OpenAiController';
import {
    ref,
    set,
    get
  } from 'firebase/database';
  import { auth, database } from '../config'; 
  import { UserContext } from '../components/UserContext';
  import { NavLink as Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import { onAuthStateChanged } from 'firebase/auth';

export default function EatIn() {
  const [foodInputs, setFoodInputs] = useState(['']);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); // Error state
  const [success, setSuccess] = useState(null); // Success state for saving recipes
  const user = auth.currentUser;
  const context = useContext(UserContext);
  const navigate = useNavigate(); 

  function getCurrentUser() {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
         
          resolve(user);
        } else {
          // No user is signed in
          reject('No user is signed in');
        }
      });
    });
  }

  getCurrentUser()
  .then((user) => {
    console.log("User:", user);
    
  })
  .catch((error) => {
    console.error("Error:", error);
  });

  
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

  // Function to save a recipe to Local Storage
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
      toast("An error occurred while setting up your profile.", { type: "error" });
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
      // Assuming recipes are separated by '###'
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
          <div
            style={{
              backgroundColor: '#dc3545', // Bootstrap's danger color
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              marginBottom: '20px',
              width: '300px',
            }}
          >
            {error}
            <button
              onClick={() => setError(null)}
              style={{
                float: 'right',
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              &times;
            </button>
          </div>
        )}

        {/* Display Success Alert */}
        {success && (
          <div
            style={{
              backgroundColor: '#28a745', 
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              marginBottom: '20px',
              width: '300px',
            }}
          >
            {success}
            <button
              onClick={() => setSuccess(null)}
              style={{
                float: 'right',
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              &times;
            </button>
          </div>
        )}

        
        {foodInputs.map((input, index) => (
          <div
            key={index}
            style={{
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="Enter ingredient"
              value={input}
              onChange={(event) => handleInputChange(index, event)}
              style={{
                padding: '10px',
                width: '300px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                marginRight: '10px',
                outline: 'none',
              }}
            />
            {foodInputs.length > 1 && (
              <button
                onClick={() => handleRemoveInput(index)}
                style={{
                  padding: '10px 15px',
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        {/* Add Ingredient Button */}
        <button
          onClick={handleAddInput}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Add Another Ingredient
        </button>

        {/* Submit Button */}
        <button
          onClick={Submit}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: 'blue',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          {loading ? 'Generating...' : 'Submit'}
        </button>

        {/* Loading Spinner */}
        {loading && (
          <div style={{ marginTop: '20px' }}>
            <div
              style={{
                border: '8px solid #f3f3f3', // Light grey background
                borderTop: '8px solid #4caf50', // Green color for the spinning part
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                animation: 'spin 2s linear infinite',
                margin: 'auto',
              }}
            />
          </div>
        )}

        {/* Display the recipes */}
        <div
          style={{
            marginTop: '30px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {recipes.map((recipe, index) => (
            <div
              key={index}
              onClick={() => handleRecipeClick(recipe)}
              style={{
                width: '300px',
                margin: '10px',
                padding: '20px',
                backgroundColor: '#f8f9fa', // Light background for contrast
                color: '#343a40', // Dark text for readability
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
            >
              <p>{recipe}</p>
              {/* Save Recipe Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering handleRecipeClick
                  handleSaveRecipe(recipe);
                }}
                style={{
                  marginTop: '10px',
                  padding: '8px 12px',
                  backgroundColor: '#28a745', // Green color
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Save Recipe
              </button>
            </div>
          ))}
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
