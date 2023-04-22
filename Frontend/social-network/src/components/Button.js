import React from 'react';

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"username": username, "password": password})
    }
    const response = await fetch('http://localhost:8393/api/login', {requestOptions});
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      console.log("Login successful!");
      localStorage.setItem('token', data.token);
      window.location.reload();
    } else {
      console.log("Login failed!");
    }
}

async function logout() {
    localStorage.removeItem('token');
    window.location.reload();
}

async function register() {
  const username = document.getElementById('register_username').value;
  const password = document.getElementById('register_password').value;
  const email = document.getElementById('email').value;
  const first_name = document.getElementById('first_name').value;
  const last_name = document.getElementById('last_name').value;
  const about_me = document.getElementById('about_me').value;
  const birthdate = document.getElementById('birthdate').value;

  const requestOptions = {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({
      "username": username,
      "password": password,
      "email": email,
      "first_name": first_name,
      "last_name": last_name,
      "about_me": about_me,
      "birthdate": birthdate
    })
  };

  const response = await fetch('http://localhost:8393/api/register', requestOptions);
  const data = await response.json();

  console.log(data);
  if (response.ok) {
    console.log("Register successful!");
    localStorage.setItem('token', data.token);
    window.location.reload();
  } else {
    console.log("Register failed!");
  }
}

function Button({ buttonType }) {
  function handleButton(event) {
    event.preventDefault();
    console.log("Button clicked!");

    switch (buttonType) {
      case 'login':
        // do something when the submit button is clicked
        console.log("login button clicked!");
        login()
        break;
      case 'logout':
        // do something when the cancel button is clicked
        console.log("logout button clicked!");
        logout();
        break;
      case 'register':
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
      <button className="btn btn-primary" onClick={handleButton}>
        {buttonType}
      </button>
    </div>
  );
}

export default Button;
