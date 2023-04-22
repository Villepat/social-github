import React from "react";
import Button from "./Button";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function Header() {
    let isLoggedIn = false;
    if(localStorage.getItem('token') === null) {
        isLoggedIn = false;
    } else {
        isLoggedIn = true;
    }
    if(!isLoggedIn) {
        return (
            <div>
                <div>
                    <LoginForm />
                </div>
                <div>
                    <RegisterForm />
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <h1>Logged in</h1>
                <Button buttonType="logout"/>
            </div>
        );
    }
}

export default Header;