import React, { useState } from "react";
import "./Login.css"
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import LoadingSpinner from "../Spinner/LoadingSpinner";







function Login({currentUser, setCurrentUser}) {
    const [loading, setLoading] = useState(false);
    const [formType, setFormType] = useState("login");
    const [successfulSignUpMessage, setSuccessfulSignUpMessage] = useState('');

    const toggleForm = (type) => {
        setFormType(type);
    };

    return (
        <div style={{position: 'relative'}}>
            {loading && <LoadingSpinner/>}
            <div className="login">
                {formType === "login" ?
                    <LoginForm
                        loading={loading}
                        setLoading={setLoading}
                        setCurrentUser={setCurrentUser}
                        successfulSignUpMessage={successfulSignUpMessage}
                        onSwitch={() => toggleForm("signup")}
                    /> :
                    <SignupForm
                        loading={loading}
                        setLoading={setLoading}
                        setCurrentUser={setCurrentUser}
                        setSuccessfulSignUpMessage={setSuccessfulSignUpMessage}
                        setFormType={setFormType}
                        onSwitch={() => toggleForm("login")}
                    />
                }
            </div>
        </div>
    );
}

export default Login;