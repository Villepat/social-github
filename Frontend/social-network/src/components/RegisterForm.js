import React from "react";
import Button from "./Button";

function RegisterForm() {
    return (
        <div className="Register">
            <h1>Register</h1>
            <form>
                <input type="text" placeholder="Username: " id="register_username" required/>
                <input type="text" placeholder="Email: " id="email" required/>
                <input type="text" placeholder="First Name: " id="first_name" required />
                <input type="text" placeholder="Last Name: " id="last_name" />
                <input type="password" placeholder="Password: " id="register_password" required/>
                <input type="password" placeholder="Confirm Password: " id="confirm_password" required/>
                <input type="text" placeholder="about me: " id="about_me" />
                <input type="text" placeholder="dd/mm/yyyy: " id="birthdate" required/>
                <Button buttonType="register"/>
            </form>
        </div>
    );
}

export default RegisterForm;