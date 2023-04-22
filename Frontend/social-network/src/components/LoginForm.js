import React from "react";
import Button from "./Button";

function LoginForm() {
    // return a login form
    return (
        <div>
            <h1>Login</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" className="form-control" placeholder="Enter username" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="text" id="password" className="form-control" placeholder="Enter password" />
                </div>
                <Button buttonType="login"/>
            </form>
        </div>
    );
}

export default LoginForm;