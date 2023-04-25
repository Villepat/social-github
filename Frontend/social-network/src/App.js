import "./App.css";
import Header from "./components/Header";
import Home from "./components/Home";
import React from "react";
import Ws from "./components/Ws";

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    // check if the user is already logged in
    if (localStorage.getItem("token") !== null) {
      setIsLoggedIn(true);
    }
  }, []);

  function handleLogin() {
    setIsLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  }

  return (
    <div className="App">
      <Header onLogin={handleLogin} onLogout={handleLogout} />
      {isLoggedIn && <Home />}
      {/* {isLoggedIn && <Ws />} */}
    </div>
  );
}

export default App;
