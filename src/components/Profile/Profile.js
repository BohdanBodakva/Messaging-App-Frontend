import React, {useEffect, useState} from "react";
import "./Profile.css";
import makeRequest from "../../logic/HttpRequests";
import {useNavigate} from "react-router-dom";
import LoadingSpinner from "../Spinner/LoadingSpinner";
import user_svg from "../../images/user.svg";
import {useLanguage} from "../../providers/translations/LanguageProvider";
import {translations} from "../../providers/translations/translations";
import settings_svg from '../../images/settings_button.svg';

function Profile({ currentUser, setCurrentUser }) {
    const { language } = useLanguage();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [nameInput, setNameInput] = useState("");
    const [surnameInput, setSurnameInput] = useState("");
    const [usernameInput, setUsernameInput] = useState("");

    const [currentPasswordInput, setCurrentPasswordInput] = useState("");
    const [newPasswordInput, setNewPasswordInput] = useState("");
    const [repeatedPasswordInput, setRepeatedPasswordInput] = useState("");

    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
    const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);



    useEffect(() => {
        if (!currentUser){
            setLoading(true);
            console.log(currentUser);

            const currentUserId = localStorage.getItem("current_user_id");

            if (currentUserId) {
                async function loadCurrentUser() {
                    const url = `/users/${currentUserId}`;

                    let response;
                    try {
                        response = await makeRequest("GET", url);

                        const user = response.data.user;
                        setCurrentUser(user);

                        setNameInput(user.name);
                        if (user.surname) {
                            setSurnameInput(user.surname);
                        }
                        setUsernameInput(user.username);
                    } catch (error) {
                        navigate("/login");
                    }

                    setLoading(false);
                }
                loadCurrentUser();
            } else {
                setLoading(false);
                navigate("/login");
                return;
            }
        }
    }, [])




    const handleInputChange = (field, value) => {
        // setUser({ ...user, [field]: value });
    };

    const togglePasswordModal = () => {
        setPasswordModalOpen(!isPasswordModalOpen);
    };

    const toggleSettingsModal = () => {
        setSettingsModalOpen(!isSettingsModalOpen);
    };

    function changePassword(){

    }

    function saveSettings(){

    }

    return (
        <div style={{position: "relative"}}>
            {loading && (<LoadingSpinner />)}
            {currentUser && (
                <div>
                    <div className={`user-settings ${isPasswordModalOpen || isSettingsModalOpen ? "blurred" : ""}`} >
                        <div className="profile-section">
                            <h2>{translations.profile[language]}</h2>
                            <div className="profile-photo">
                                <img src={currentUser.profile_photo_link ? currentUser.profile_photo_link : user_svg}
                                     alt="User"/>
                            </div>
                            <div className="user-fields">
                                <label>
                                    {translations.name[language]}
                                    <input
                                        type="text"
                                        value={currentUser.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                    />
                                </label>
                                <label>
                                    {translations.surname[language]}
                                    <input
                                        type="text"
                                        value={currentUser.surname}
                                        onChange={(e) => handleInputChange("surname", e.target.value)}
                                    />
                                </label>
                                <label>
                                    {translations.username[language]}
                                    <input
                                        type="text"
                                        value={currentUser.username}
                                        onChange={(e) => handleInputChange("username", e.target.value)}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="setting-buttons">
                            <div className="change-password">
                                <button className="save-button" onClick={togglePasswordModal}>
                                    {translations.changePassword[language]}
                                </button>
                            </div>
                            <div className="change-password">
                                <button className="save-button" onClick={toggleSettingsModal}>
                                    <img src={settings_svg} alt="settings" className="chat-photo"/>
                                </button>
                            </div>
                        </div>
                        <button className="save-button">
                            {translations.save[language]}
                        </button>
                    </div>

                    {isPasswordModalOpen && (
                        <ChangePassword
                            onClose={togglePasswordModal}
                            changePassword={changePassword}
                        />
                    )}

                    {isSettingsModalOpen && (
                        <Settings
                            currentUser={currentUser}
                            handleInputChange={handleInputChange}
                            onClose={toggleSettingsModal}
                            saveSettings={saveSettings}/>
                    )}
                </div>
            )}
        </div>
    );
}

function ChangePassword({onClose, changePassword}) {
    const { language } = useLanguage();

    return (
        <div className="password-modal">
        <div className="password-modal-content">
                <h3>{translations.changePassword[language]}</h3>
                <label>{translations.currentPassword[language]}</label>
                <input type="password"/>
                <label>{translations.newPassword[language]}</label>
                <input type="password"/>
                <label>{translations.confirmPassword[language]}</label>
                <input type="password"/>
                <button className="save-password-button" onClick={changePassword}>
                    {translations.save[language]}
                </button>
                <button className="cancel-button" onClick={onClose}>
                    {translations.cancel[language]}
                </button>
            </div>
        </div>
    );
}

function Settings({currentUser, handleInputChange, onClose, saveSettings}) {
    const { language } = useLanguage();

    return (
        <div className="password-modal">
            <div className="password-modal-content">
                <div className="settings-section">
                    <h3>{translations.settings[language]}</h3>
                    <label>
                        {translations.theme[language]}
                        <select
                            value={currentUser.theme}
                            onChange={(e) => handleInputChange("theme", e.target.value)}
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </label>
                    <label>
                        {translations.notifications[language]}
                        <input
                            type="checkbox"
                            checked={currentUser.notifications}
                            onChange={(e) =>
                                handleInputChange("notifications", e.target.checked)
                            }
                        />
                    </label>
                    <label>
                        {translations.language[language]}
                        <select
                            value={currentUser.language}
                            onChange={(e) => handleInputChange("language", e.target.value)}
                        >
                            <option value="en">English</option>
                            <option value="es">Українська</option>
                            <option value="fr">Deutsch</option>
                        </select>
                    </label>
                </div>
                <button className="save-password-button" onClick={saveSettings}>
                    {translations.save[language]}
                </button>
                <button className="cancel-button" onClick={onClose}>
                    {translations.cancel[language]}
                </button>
            </div>
        </div>
    );
}

export default Profile;
