import React from 'react';
import { useNavigate } from 'react-router-dom';


import Navbar from '../components/navbar';



export default function Home() {
  const buttonStyle = {
    height: '10vh',
    margin: '5px 0',
    borderRadius: '10px',
    border: '1px solid black',
    backgroundColor: 'transparent', 
    color: 'white' 
};
const navigate = useNavigate();

  return (
    <>
    <Navbar />
    <style>
                {`
                @keyframes rotate {
                    0% { transform: rotate(0deg); }
                    50% { transform: rotate(380deg); }
                    100% { transform: rotate(0deg); }
                }

                .button-container {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                    align-items: center;
                    width: 100%;
                }
                      .button-container button {
                  
                    width: 20%;
                }

                
                @media (max-width: 768px) {
                    .button-container {
                        flex-direction: column;
                        align-items: center; 
                    }

                    .button-container button {
                        width: 75%; 
                    }
                }
                `}
            </style>
    <div style={{ background: "linear-gradient(to bottom, red, white)", color: 'white', minHeight: '100vh', overflow: 'hidden', paddingBottom: "3%" }}>
      <h1 style={{ textAlign: 'center', color: 'white', fontSize: '4em' }}>I Want To...</h1>
      
      <div className="button-container">
                    <button
                        onClick={() => navigate('/eat-in')}
                        style={{ ...buttonStyle }}
                    >
                        Eat In
                    </button>

                    <button
                        onClick={() => navigate('/eat-out')}
                        style={{ ...buttonStyle, backgroundColor: 'red', color: 'white' }}
                    >
                        Eat Out
                    </button>
                    </div>
    </div>
    </>
  )
}



    