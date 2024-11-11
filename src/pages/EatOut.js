import React, {useContext, useState } from 'react';
import Navbar from '../components/navbar';
import { generateEatOut } from '../components/OpenAiController';
import {
    ref,
    set,
    get
  } from 'firebase/database';
import { NavLink as Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import { auth, database } from '../config'; 
  import { UserContext } from '../components/UserContext';
import { onAuthStateChanged } from 'firebase/auth';

export default function EatOut() {
  const [foodInputs, setFoodInputs] = useState(['']);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [success, setSuccess] = useState(null);
  const context = useContext(UserContext);
  const navigate = useNavigate(); 
  const user = auth.currentUser;


  const handleSaveRecipe = async (recipe) => {
    try {
      const userRef = ref(database, `My-Profile/${user.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userInfo = snapshot.val();
        const savedRestaurants = userInfo.savedRestaurants || [];
        if (savedRestaurants.includes(recipe)) {
          console.log('Recipe already saved:', recipe);
          return;
        }
        savedRestaurants.push(recipe);
        await set(userRef, { ...userInfo, savedRestaurants });
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

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            resolve(userLocation);
          },
          (error) => {
            console.error('Error getting location:', error);
            setLocationError(error.message);
            reject(error);
          }
        );
      } else {
        const error = new Error('Geolocation is not supported by this browser.');
        alert(error.message);
        reject(error);
      }
    });
  };

  // Updated reverseGeocode function using OpenCage Geocoder API
  const reverseGeocode = async (latitude, longitude) => {
    const apiKey = 'ba2c4d21f0a546fea0a17ae2d61737e6'; // Replace with your actual API key
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
      );
      const data = await response.json();
      if (data && data.results && data.results.length > 0) {
        const components = data.results[0].components;
        return components.city || components.town || components.village || components.state;
      } else {
        throw new Error('No results from reverse geocoding.');
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      throw error;
    }
  };

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
      alert('Please fill in all food fields before adding a new one.');
    }
  };

  const handleRemoveInput = (index) => {
    if (foodInputs.length > 1) {
      const values = [...foodInputs];
      values.splice(index, 1);
      setFoodInputs(values);
    } else {
      alert('You must have at least one food item.');
    }
  };

  const handleRecipeClick = (recipe) => {
    // Handle recipe click (e.g., show details)
    alert('Recommendation clicked:\n' + recipe);
  };

  const stripMarkdown = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, '$1'); 
  };
  
  const parseRecommendations = (text) => {
    // Find where the numbered list starts
    const listStartIndex = text.indexOf('1.');
    if (listStartIndex === -1) return [];
    const listText = text.substring(listStartIndex);

    
    let items = listText.split(/\n(?=\d\.)/).map((item) => item.trim());

   items = items.map(stripMarkdown);

    return items.filter((item) => item !== '');
  };

  const Submit = async (e) => {
    e.preventDefault();

    const allFilled = foodInputs.every((input) => input.trim() !== '');
    if (!allFilled) {
      alert('Please fill in all food fields before submitting.');
      return;
    }

    setRecipes([]);
    setLoading(true);

    try {
      const userLocation = await getUserLocation();

      // Reverse geocode to get city name
      const cityName = await reverseGeocode(userLocation.latitude, userLocation.longitude);

      if (!cityName) {
        alert('Unable to determine your city from your location.');
        setLoading(false);
        return;
      }

      console.log('City Name:', cityName);

      // Pass cityName to generateEatOut instead of raw coordinates
      const generatedRecommendations = await generateEatOut(foodInputs, cityName);

      // Parse the recommendations into individual items
      const recommendations = parseRecommendations(generatedRecommendations);

      setRecipes(recommendations);
      console.log('Generated Recommendations:', recommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      alert('An error occurred while generating recommendations.');
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
        <p style={{ textAlign: 'center', color: 'white', fontSize: '4em' }}>
          What are you in the mood for?
        </p>
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
              placeholder="Enter Food"
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
          </div>
        ))}
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
          Add Another Item
        </button>
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
          Submit
        </button>
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
        {/* Display the recommendations */}
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
                Save Restaurant
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
