import "./App.css";
import Header from "./components/Header";
import Home from "./components/Home";
import React from "react";
import Cookies from "js-cookie";
import Ws from "./components/Ws";

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    // check if the user is already logged in
    if (Cookies.get("token") !== undefined) {
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
