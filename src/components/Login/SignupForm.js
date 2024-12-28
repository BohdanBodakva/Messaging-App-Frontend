import "./Login.css"
import {useEffect, useState} from "react";
import makeRequest from "../../logic/HttpRequests";
import {useNavigate} from "react-router-dom";
import {useLanguage} from "../../providers/translations/LanguageProvider";
import {translations} from "../../providers/translations/translations";

function SignupForm({ setLoading, setSuccessfulSignUpMessage, onSwitch, setFormType }) {
    const { language } = useLanguage();
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleSurnameChange = (event) => {
        setSurname(event.target.value);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleRepeatedPasswordChange = (event) => {
        setRepeatedPassword(event.target.value);
    };

    function validatePassword(){
        return password === repeatedPassword
    }

    async function signUpUser(event){
        event.preventDefault();

        if (!validatePassword()){
            setErrorMessage("Passwords don't match");

            setName('');
            setSurname('');
            setUsername('');
            setPassword('');
            setRepeatedPassword('');
        } else {
            await _signUpUser()
        }
    }

    async function _signUpUser(){
        // SIGN UP
        const signUpUrl = "/auth/signup"

        const body = {
            "name": name,
            "surname": surname,
            "username": username,
            "password": password,
        }

        setLoading(true);

        let loginResponse;
        try{
            loginResponse = await makeRequest("POST", signUpUrl, body);

            if (loginResponse.status === 201){
                setSuccessfulSignUpMessage("User is registered successfully. Please log in.");
                setFormType("login");
            } else {
                setErrorMessage(loginResponse.data.msg);
            }
        } catch (error) {
            setErrorMessage(error.message);
        }

        setLoading(false);
        setName('');
        setSurname('');
        setUsername('');
        setPassword('');
        setRepeatedPassword('');
    }

    useEffect(() => {
        setSuccessfulSignUpMessage('');
    }, [])

    return (
        <div className="form-container">
            <h2>{translations.signup[language]}</h2>
            <form onSubmit={signUpUser}>
                <input
                    value={name}
                    onChange={handleNameChange}
                    type="text"
                    placeholder={translations.name[language]}
                    required
                />
                <input
                    value={surname}
                    onChange={handleSurnameChange}
                    type="text"
                    placeholder={translations.surname[language]}
                    required
                />
                <input
                    value={username}
                    onChange={handleUsernameChange}
                    type="text"
                    placeholder={translations.username[language]}
                    required
                />
                <input
                    value={password}
                    onChange={handlePasswordChange}
                    type="password"
                    placeholder={translations.password[language]}
                    required
                />
                <input
                    value={repeatedPassword}
                    onChange={handleRepeatedPasswordChange}
                    type="password"
                    placeholder={translations.repeatPassword[language]}
                    required
                />
                {errorMessage &&
                    <div className="error-message" id="error-message">
                        <span className="error-icon">⚠️</span>
                        <span className="error-text">{errorMessage}</span>
                    </div>
                }
                <button type="submit">{translations.signup[language]}</button>
            </form>
            <div className="toggle">
                <button onClick={onSwitch}>{translations.alreadyHaveAccountMessage[language]}</button>
            </div>
        </div>
    );
}

export default SignupForm;