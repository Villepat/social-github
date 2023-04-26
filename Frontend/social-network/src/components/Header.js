import React from "react";
import Button from "./Button";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Cookies from "js-cookie";

function Header() {
  let isLoggedIn = false;
  // check if cookie named token exists

  if (Cookies.get("token") === undefined) {
    isLoggedIn = false;
  } else {
    isLoggedIn = true;
  }
  if (!isLoggedIn) {
    return (
      <div>
        <div className="loginregister-container">
          <LoginForm />

          <RegisterForm />
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Logged in</h1>
        <Button buttonType="Logout" />
      </div>
    );
  }
}

export default Header;
