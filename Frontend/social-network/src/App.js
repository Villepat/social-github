import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import React from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    // check if the user is already logged in
    if (localStorage.getItem('token') !== null) {
      setIsLoggedIn(true);
    }
  }, []);

  function handleLogin() {
    setIsLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  }

  return (
    <div className="App">
      
      <Header onLogin={handleLogin} onLogout={handleLogout} />
      {isLoggedIn && <Home />}
    </div>
  );
}

export default App;
