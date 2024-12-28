import "./Login.css"
import makeRequest from "../../logic/HttpRequests";
import {useState} from "react";
import { useNavigate } from "react-router-dom";
import {useLanguage} from "../../providers/translations/LanguageProvider";
import {translations} from "../../providers/translations/translations";

function LoginForm({ setLoading, setCurrentUser, onSwitch, successfulSignUpMessage }) {
    const { language } = useLanguage();

    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };


    async function loginUser(event){
        event.preventDefault();
        setErrorMessage('');

        // LOGIN
        const loginUrl = "/auth/login"

        const body = {
            "username": username,
            "password": password,
        }

        setLoading(true);

        let loginResponse;
        try{
            loginResponse = await makeRequest("POST", loginUrl, body);

            const token = loginResponse.data.token;
            const currentUserId = loginResponse.data.current_user_id;
            localStorage.setItem("token", token);
            localStorage.setItem("current_user_id", currentUserId);

            // GET CURRENT USER
            const url = `/users/${currentUserId}`

            let getUserResponse;
            try{
                getUserResponse = await makeRequest("GET", url, null);

                const currentUser = getUserResponse.data.user;
                setCurrentUser(currentUser);

                navigate("/");
            } catch (error) {
                setErrorMessage(error.message);
            }
        } catch (error) {
            setErrorMessage(error.message);
        }

        setLoading(false);
        setUsername('');
        setPassword('');
    }


    return (
        <div className="form-container">
            <h2>{translations.login[language]}</h2>
            <form onSubmit={loginUser}>
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
                {errorMessage &&
                <div className="error-message" id="error-message">
                    <span className="error-icon">⚠️</span>
                    <span className="error-text">{errorMessage}</span>
                </div>
                }
                {successfulSignUpMessage &&
                    <div className="success-message" id="success-message">
                        <span className="error-icon">✅️</span>
                        <span className="error-text">{translations.successfulSignUpMessage[language]}</span>
                    </div>
                }
                <button type="submit">{translations.login[language]}</button>
            </form>
            <div className="toggle">
                <button onClick={onSwitch}>{translations.dontHaveAccountMessage[language]}</button>
            </div>
        </div>
    );
}


export default LoginForm;