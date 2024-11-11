import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import Home from './pages/Home'
import Landing from './pages/Landing';
import SignInApp from './SignInApp';
import EatOut from './pages/EatOut';
import EatIn from './pages/EatIn';
import Profile from './pages/Profile';
import SavedItems from './pages/SavedItems';

ReactDOM.render(
    <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
            <Route path="/sign-up" element={<App />} /> 
            <Route path="/home" element={<Home />}></Route>
            <Route path="/sign-in" element={<SignInApp />} />
            <Route path="/eat-out" element={<EatOut />} />
            <Route path="/eat-in" element={<EatIn />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/saved-items" element={<SavedItems />} />
        </Routes>
    </Router>,
    document.getElementById('root')
);