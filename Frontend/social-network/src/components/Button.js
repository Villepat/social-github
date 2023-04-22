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
