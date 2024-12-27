import "./Login.css"
import makeRequest from "../../logic/HttpRequests";
import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

function LoginForm({ setLoading, setCurrentUser, onSwitch, successfulSignUpMessage }) {
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
            <h2>Login</h2>
            <form onSubmit={loginUser}>
                <input
                    value={username}
                    onChange={handleUsernameChange}
                    type="text"
                    placeholder="Username"
                    required
                />
                <input
                    value={password}
                    onChange={handlePasswordChange}
                    type="password"
                    placeholder="Password"
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
                        <span className="error-text">{successfulSignUpMessage}</span>
                    </div>
                }
                <button type="submit">Login</button>
            </form>
            <div className="toggle">
                <button onClick={onSwitch}>Don't have account? Sign up</button>
            </div>
        </div>
    );
}


export default LoginForm;