import React from "react";
// import Button from "./Button";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Cookies from "js-cookie";











//----------------------Obs!!----------//
//Not in use any more, moved to Home.js


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
  // } else {
  //   return (
  //     <div className="h">
  //       <style jsx>{`
  //         .h {
  //           display: flex;
  //           justify-content: space-between;
  //           align-items: center;
  //           padding: 0 1rem;
  //           margin-top: 5rem;
  //           height: 3rem;
  //           border-bottom: 1px solid #e5e5e5;
  //         }
  //       `}</style>

  //       <h1>Logged in</h1>
  //       <Button buttonType="Logout" />
  //     </div>
    // );
  }
}

export default Header;
