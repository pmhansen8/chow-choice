// App.js
import React from 'react';
import { UserProvider } from './components/UserContext';
import SignUp from './pages/SignUp';


function App() {
  return (
    <UserProvider>
      
      <SignUp />
      
    </UserProvider>
  );
}

export default App;
