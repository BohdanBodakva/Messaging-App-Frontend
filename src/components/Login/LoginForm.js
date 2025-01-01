import "./Login.css"
import makeRequest from "../../logic/HttpRequests";
import {useState} from "react";
import { useNavigate } from "react-router-dom";
import {useLanguage} from "../../providers/translations/LanguageProvider";
import {translations} from "../../providers/translations/translations";
import {User} from "../../models/User";

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

        setLoading(true);

        // LOGIN
        const loginUrl = "/auth/login"
        const body = {
            "username": username,
            "password": password,
        }

        const loginResponse = await makeRequest("POST", loginUrl, body);

        if (loginResponse.errorMessage) {
            setErrorMessage(loginResponse.errorMessage);
        } else {
            const accessToken = loginResponse.response.data.access_token;
            const refreshToken = loginResponse.response.data.refresh_token;
            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);

            // Get current user
            const url = `/users/current-user`

            const getUserResponse = await makeRequest("GET", url);

            if (getUserResponse.errorMessage) {
              setErrorMessage(getUserResponse.errorMessage);
            } else {
                setErrorMessage("");

                const currentUser = User.fromJson(getUserResponse.response.data.user)
                setCurrentUser(currentUser);

                navigate("/");
            }
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