import React from "react";
import Button from "./Button";
import LoginForm from "./LoginForm";

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
            <LoginForm />
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