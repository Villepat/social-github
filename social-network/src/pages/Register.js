import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "../css/Register.css";

function Register() {
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

        // Call backend API to register user with form data
        fetch("http://localhost:6969/api/register", {
        method: "POST",
        body: formData,
        credentials: "include",
        })
        .then((response) => {
            if (response.ok) {
            // Handle successful registration
            setRegistrationSuccess(true);
            setRegisterError(false);
            } else {
            // Handle unsuccessful registration
            setRegistrationSuccess(false);
            setRegisterError(true);
            }
        }
        );
    }

    return (
        <div className="register">
        <h2>Register</h2>
    <form onSubmit={handleRegisterSubmit}>
        <div>
        <label htmlFor="registerEmail">Email:</label>
        <input
            type="email"
            id="registerEmail"
            autoComplete="username"
            value={registerEmail}
            onChange={(event) => setRegisterEmail(event.target.value)}
        />
        </div>
        <div>
        <label htmlFor="registerPassword">Password:</label>
        <input
            type="password"
            id="registerPassword"
            autoComplete="new-password"
            value={registerPassword}
            onChange={(event) => setRegisterPassword(event.target.value)}
        />
        </div>
        <div>
        <label htmlFor="registerConfirmPassword">Confirm Password:</label>
        <input
            type="password"
            id="registerConfirmPassword"
            autoComplete="new-password"
            value={registerConfirmPassword}
            onChange={(event) => setRegisterConfirmPassword(event.target.value)}
        />
        </div>
        <div>
        <label htmlFor="registerNickname">Nickname:</label>
        <input
            type="text"
            id="registerNickname"
            value={registerNickname}
            onChange={(event) => setRegisterNickname(event.target.value)}
        />
        </div>
        <div>
        <label htmlFor="registerFirstName">First Name:</label>
        <input
            type="text"
            id="registerFirstName"
            value={registerFirstName}
            onChange={(event) => setRegisterFirstName(event.target.value)}
        />
        </div>
        <div>
        <label htmlFor="registerLastName">Last Name:</label>
        <input
            type="text"
            id="registerLastName"
            value={registerLastName}
            onChange={(event) => setRegisterLastName(event.target.value)}
        />
        </div>
        <div>
        <label htmlFor="registerBirthday">Birthday:</label>
        <input
            type="text"
            id="registerBirthday"
            value={registerBirthday}
            onChange={(event) => setRegisterBirthday(event.target.value)}
        />
        </div>
        <div>
        <label htmlFor="registerAboutMe">About Me:</label>
        <input
            type="text"
            id="registerAboutMe"
            value={registerAboutMe}
            onChange={(event) => setRegisterAboutMe(event.target.value)}
        />
        </div>
        <div>
        <label htmlFor="registerProfilePicture">Profile Picture:</label>
        <input
            type="file"
            id="registerProfilePicture"
            onChange={(event) =>
            setRegisterProfilePicture(event.target.files[0])
            }
        />
        </div>
        <button className="button" type="submit">Register</button>
        {registrationSuccess && <p>Registration successful!</p>}
        {registerError && (
        <p>Registration failed. Please try again with a different email.</p>
        )}
    </form>
    </div>
    );
}

export default Register;