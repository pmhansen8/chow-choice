import Navbar from '../components/navbar';
import { useNavigate } from 'react-router-dom';
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';

export default function Landing() {
    const navigate = useNavigate();

    const buttonStyle = {
        height: '10vh',
        margin: '5px 0',
        borderRadius: '10px',
        border: '1px solid black',
        backgroundColor: 'transparent', 
        color: 'white' 
    };

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

                
                <p style={{ textAlign: 'center', color: 'white', fontSize: '4em' }}>
                    CHOW CHOICE
                </p>
                <p style={{ textAlign: 'center', color: 'white', fontSize: '2em' }}>From cravings to quick bites, we've got you covered!</p>

              
                <div className="button-container">
                    <button
                        onClick={() => navigate('/home')}
                        style={{ ...buttonStyle }}
                    >
                        Home
                    </button>

                    <button
                        onClick={() => navigate('/leader-board')}
                        style={{ ...buttonStyle, backgroundColor: 'red', color: 'white' }}
                    >
                        About 
                    </button>

                    <button
                        onClick={() => navigate('/sign-up')}
                        style={{ ...buttonStyle }}
                    >
                        Sign Up
                    </button>

                    <button
                        onClick={() => navigate('/settings')}
                        style={{ ...buttonStyle, backgroundColor: 'red', color: 'white' }}
                    >
                        Settings
                    </button>
                </div>
            </div>
        </>
    );
}
