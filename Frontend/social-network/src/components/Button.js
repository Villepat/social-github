import React from "react";

async function login(newUsername, newPassword) {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  if (newUsername && newPassword) {
    username = newUsername;
    password = newPassword;
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + btoa(username + ":" + password),
    },
  };
  const response = await fetch(
    "http://localhost:6969/api/login",
    requestOptions
  );
  const data = await response.json();
  console.log(data);
  if (response.ok) {
    console.log("Login successful!");
    localStorage.setItem("token", data.token);
    window.location.reload();
  } else if (data.status === 401) {
    alert("Wrong username or password! Please try again.");
    console.log("Login failed!");
  } else if (data.status === 500) {
    alert("Something went wrong! Please try again.");
    console.log("Login failed!");
  }
}

async function logout() {
  localStorage.removeItem("token");
  window.location.reload();
}

async function register() {
  const usernameInput = document.getElementById("register_username");
  const passwordInput = document.getElementById("register_password");
  const confirmPasswordInput = document.getElementById("confirm_password");
  const emailInput = document.getElementById("email");
  const firstNameInput = document.getElementById("first_name");
  const lastNameInput = document.getElementById("last_name");
  const aboutMeInput = document.getElementById("about_me");
  const birthdateInput = document.getElementById("birthdate");

  // Check if all required fields are filled
  if (
    usernameInput.value &&
    passwordInput.value &&
    emailInput.value &&
    firstNameInput.value &&
    birthdateInput.value &&
    passwordInput.value === confirmPasswordInput.value
  ) {
    const requestOptions = {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        username: usernameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        name: firstNameInput.value,
        surname: lastNameInput.value,
        birthdate: birthdateInput.value,
        aboutme: aboutMeInput.value,
      }),
    };

    const response = await fetch(
      "http://localhost:6969/api/register",
      requestOptions
    );
    const data = await response.json();

    console.log(data);
    if (response.ok) {
      console.log("Register successful!");
      login(usernameInput.value, passwordInput.value);
    } else if (data.status === 500) {
      alert("Username or email already exists! Please try again.");
      console.log("Register failed!");
    }
  } else {
    // If not all required fields are filled, show an error message
    alert("No funny business be civilized.");
  }
}

function Button({ buttonType }) {
  function handleButton(event) {
    event.preventDefault();
    console.log("Button clicked!");

    switch (buttonType) {
      case "Login":
        // do something when the submit button is clicked
        console.log("login button clicked!");
        login();
        break;
      case "Logout":
        // do something when the cancel button is clicked
        console.log("logout button clicked!");
        logout();
        break;
      case "Register":
        // do something when the cancel button is clicked
        console.log("register button clicked!");
        register();
        break;
      default:
        // handle any other button type
        console.log("Unknown button type clicked!");
        break;
    }
  }

  return (
    <div>
      <button className="btn" onClick={handleButton}>
        {buttonType}
      </button>
    </div>
  );
}

export default Button;
