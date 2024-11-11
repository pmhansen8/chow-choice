// RecipeCard.js
import React from 'react';

const RecipeCard = ({ recipe, handleSaveRecipe }) => {
  // Function to parse the recipe string
  const parseRecipe = (recipeStr) => {
    const nameMatch = recipeStr.match(/\d+\.\s\*\*(.*?)\*\*/);
    const ingredientsMatch = recipeStr.match(/\*\*Ingredients:\*\*(.*?)\*\*Instructions:/s);
    const instructionsMatch = recipeStr.match(/\*\*Instructions:\*\*(.*)/s);

    const name = nameMatch ? nameMatch[1] : 'Unnamed Recipe';
    const ingredients = ingredientsMatch
      ? ingredientsMatch[1].trim().split('\n- ').map(ing => ing.replace(/^- /, ''))
      : [];
    const instructions = instructionsMatch
      ? instructionsMatch[1].trim().split('\n').map(ins => ins.replace(/^\d+\.\s*/, ''))
      : [];

    return { name, ingredients, instructions };
  };

  const { name, ingredients, instructions } = parseRecipe(recipe);

  return (
    <div style={styles.card}>
      <h2 style={styles.recipeName}>{name}</h2>

      <div style={styles.section}>
        <h3 style={{ color: 'black' }}>Ingredients:</h3>
        <ul>
          {ingredients.map((ingredient, idx) => (
            <li key={idx} style={{ color: 'black' }}>{ingredient}</li>
          ))}
        </ul>
      </div>

      <div style={styles.section}>
        <h3 style={{ color: 'black' }}>Instructions:</h3>
        <ol>
          {instructions.map((instruction, idx) => (
            <li key={idx} style={{ color: 'black' }}>{instruction}</li>
          ))}
        </ol>
      </div>

      <button
        onClick={() => handleSaveRecipe(recipe)}
        style={styles.saveButton}
      >
        Save Recipe
      </button>
    </div>
  );
};

const styles = {
  card: {
    width: '100%',
    maxWidth: '600px',
    margin: '20px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  recipeName: {
    color: '#333',
    marginBottom: '15px',
  },
  section: {
    marginBottom: '15px',
  },
  saveButton: {
    padding: '10px 15px',
    backgroundColor: '#28a745', // Green color
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default RecipeCard;
