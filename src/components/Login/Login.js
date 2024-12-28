import React, { useState } from "react";
import "./Login.css"
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import LoadingSpinner from "../Spinner/LoadingSpinner";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import {useLanguage} from "../../providers/translations/LanguageProvider";
import {translations} from "../../providers/translations/translations";






function Login({currentUser, setCurrentUser}) {
    const { language, changeLanguage } = useLanguage();

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
                <div className="lang-selector-top">
                    <div className="choose-lang-text">
                        <p>{translations.changeLanguage[language]}</p>
                    </div>
                    <div className="lang-selector">
                        <LanguageSelector
                            currentLanguageKey={language}
                            onLanguageChange={changeLanguage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;