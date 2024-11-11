import React, { useState } from 'react';
import './App.css';
import { UserContext } from './components/UserContext';
import SignIn from './pages/Signin';

function SignInApp() {
    const [user, setUser] = useState(null);
    document.title = "Chow Choice";

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <SignIn />
        </UserContext.Provider>
    );
}

export default SignInApp;