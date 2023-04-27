import "./App.css";
// import Header from "./components/Header";
import Home from "./components/Home";
import React from "react";
import Cookies from "js-cookie";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";


function App() {

  let logeedIn = false;
  if (Cookies.get("token") === undefined) {
    logeedIn = false;
  } else {
    logeedIn = true;
  }
  

  return (
    <>
    <div className="App">
      <Routes>
    {logeedIn ? ( 
      <Route path="/" element={<Home />} /> 
      ) : (
        <Route path="/" element={<div><LoginForm/><RegisterForm/></div>}  />
        ) }
      </Routes>
    </div>
    </>
  );
}



export default App;
