import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "../css/Login.css";

function Login() {
  const navigate = useNavigate();
  const { setLoggedIn, checkLoginStatus } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerNickname, setRegisterNickname] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerBirthday, setRegisterBirthday] = useState("");
  const [registerAboutMe, setRegisterAboutMe] = useState("");
  const [registerProfilePicture, setRegisterProfilePicture] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registerError, setRegisterError] = useState(false);

  function navigateToHomePage() {
    navigate("/");
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    // Call backend API to log in user with email and password
    const response = await fetch("http://localhost:6969/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (response.ok) {
      // Handle successful login
      // Call checkLoginStatus function from AuthContext to fetch the login status
      await checkLoginStatus(); // Make sure to import it from your AuthContext
      setLoggedIn(true);
      navigateToHomePage();
    } else {
      // Handle unsuccessful login
      alert("Invalid email or password. Please try again.");
    }
  }

  function handleRegisterSubmit(event) {
    event.preventDefault();
    if (registerPassword !== registerConfirmPassword) {
      // Handle case where password and confirm password do not match
      alert("Passwords do not match. Please try again.");
      return;
    }

    // Create a FormData object and append all the form fields
    const formData = new FormData();
    formData.append("email", registerEmail);
    formData.append("password", registerPassword);
    formData.append("nickname", registerNickname);
    formData.append("firstName", registerFirstName);
    formData.append("lastName", registerLastName);
    formData.append("birthday", registerBirthday);
    formData.append("aboutMe", registerAboutMe);
    formData.append("profilePicture", registerProfilePicture);
    fetch("http://localhost:6969/api/register", {
      method: "POST",
      headers: {},
      body: formData,
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          // Handle successful registration
          setRegistrationSuccess(true);
          setEmail(registerEmail);
          setPassword(registerPassword);
          setRegisterAboutMe("");
          setRegisterBirthday("");
          setRegisterConfirmPassword("");
          setRegisterEmail("");
          setRegisterFirstName("");
          setRegisterLastName("");
          setRegisterNickname("");
          setRegisterPassword("");
          setRegisterProfilePicture(null);
        } else {
          // Handle unsuccessful registration
          setRegisterError(true);
          handleRegisterSubmit();
        }
      })
      .catch((error) => {
        // Handle error
      });
  }

  return (
    <div className="Login">
      <h2>Login</h2>
      <form onSubmit={handleLoginSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button className="button" type="submit">Login</button>
      </form>
      </div>
  );
}

export default Login;