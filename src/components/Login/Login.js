import React, { useState } from "react";
import "./Login.css"
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

function Login({ onSwitch }) {
    const [formType, setFormType] = useState("login");

    const toggleForm = (type) => {
        setFormType(type);
    };

    return (
        <div className="login">
            {formType === "login" ?
                <LoginForm onSwitch={() => toggleForm("signup")} /> :
                <SignupForm onSwitch={() => toggleForm("login")} />}
        </div>
    );
}

export default Login;