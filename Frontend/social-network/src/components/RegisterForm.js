import React from "react";
import Button from "./Button";

function RegisterForm() {
    return (
        <div>
            <h1>Register</h1>
            <form>
                <input type="text" placeholder="Username" id="register_username" />
                <input type="text" placeholder="Email" id="email" />
                <input type="text" placeholder="First Name" id="first_name" />
                <input type="text" placeholder="Last Name" id="last_name" />
                <input type="password" placeholder="Password" id="register_password" />
                <input type="password" placeholder="Confirm Password" id="confirm_password" />
                <input type="text" placeholder="about me" id="about_me" />
                <input type="text" placeholder="dd/mm/yyyy" id="birthdate" />
                <Button buttonType="register"/>
            </form>
        </div>
    );
}

export default RegisterForm;