import React, {useEffect, useState} from "react";
import "./Profile.css";
import {useNavigate} from "react-router-dom";
import LoadingSpinner from "../Spinner/LoadingSpinner";
import user_svg from "../../images/user.svg";
import {useLanguage} from "../../providers/translations/LanguageProvider";
import {translations} from "../../providers/translations/translations";
import settings_svg from '../../images/settings_button.svg';
import back_button_svg from "../../images/back_button.svg";

function Profile({ currentUser, setCurrentUser, onBack }) {
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

        setNameInput(currentUser.name);
        if (currentUser.surname) {
            setSurnameInput(currentUser.surname);
        }
        setUsernameInput(currentUser.username);

    }, [currentUser])




    const handleInputChange = (field, value) => {
        if (field === "name") {
            setNameInput(value);
        } else if (field === "surname") {
            setSurnameInput(value);
        } else if (field === "username") {
            setUsernameInput(value);
        } else if (field === "currentPasswordInput") {
            setCurrentPasswordInput(value);
        } else if (field === "newPasswordInput") {
            setNewPasswordInput(value);
        } else if (field === "repeatedPasswordInput") {
            setRepeatedPasswordInput(value);
        } else if (field === "currentPasswordInput") {
            setCurrentPasswordInput(value);
        } else if (field === "newPasswordInput") {
            setNewPasswordInput(value);
        } else if (field === "repeatedPasswordInput") {
            setRepeatedPasswordInput(value);
        }
    };

    const togglePasswordModal = () => {
        setPasswordModalOpen(!isPasswordModalOpen);

        setCurrentPasswordInput('');
        setNewPasswordInput('');
        setRepeatedPasswordInput('');
    };

    const toggleSettingsModal = () => {
        setSettingsModalOpen(!isSettingsModalOpen);
    };

    function changePassword(){

    }

    function saveSettings(){

    }

    function selectNewPhoto() {

    }

    return (
        <div style={{position: "relative"}}>
            {loading && (<LoadingSpinner />)}
            {currentUser && (
                <div>
                    <div className={`user-settings ${isPasswordModalOpen || isSettingsModalOpen ? "blurred" : ""}`} >
                        <div className="profile-section">
                            <div className="profile-header">
                                <div className="go-back">
                                    <button className="back-button" onClick={onBack}>
                                        <img src={back_button_svg} alt={currentUser.username}
                                             className="back-button-image"/>
                                    </button>
                                </div>
                                <h2>{translations.profile[language]}</h2>
                                <div className="go-back">
                                    <button className="back-button" onClick={onBack}>
                                        <img src={back_button_svg} alt={currentUser.username}
                                             className="back-button-image"/>
                                    </button>
                                </div>
                            </div>
                            <div className="profile-photo">
                                <div className="profile-photo-image">
                                    <img
                                        src={currentUser.profile_photo_link ? currentUser.profile_photo_link : user_svg}
                                        alt="User"
                                    />
                                </div>
                                <div className="choose-photo">
                                    <input type="file" id="file" className="file-input" onChange={selectNewPhoto}
                                           multiple/>
                                    <label htmlFor="file" className="file-label">
                                        <span className="file-icon">📁</span>
                                    </label>
                                </div>
                            </div>
                            <div className="user-fields">
                                <label>
                                    {translations.name[language]}
                                    <input
                                        type="text"
                                        value={nameInput}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                    />
                                </label>
                                <label>
                                    {translations.surname[language]}
                                    <input
                                        type="text"
                                        value={surnameInput}
                                        onChange={(e) => handleInputChange("surname", e.target.value)}
                                    />
                                </label>
                                <label>
                                    {translations.username[language]}
                                    <input
                                        type="text"
                                        value={usernameInput}
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
                            currentPassword={currentPasswordInput}
                            newPassword={newPasswordInput}
                            repeatedPassword={repeatedPasswordInput}
                            handleInputChange={handleInputChange}
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

function ChangePassword({onClose, handleInputChange, changePassword, currentPassword, newPassword, repeatedPassword}) {
    const { language } = useLanguage();

    return (
        <div className="password-modal">
            <div className="password-modal-content">
                <h3>{translations.changePassword[language]}</h3>
                <label>{translations.currentPassword[language]}</label>
                <input type="password" value={currentPassword} onChange={(e) => handleInputChange("currentPasswordInput", e.target.value)}/>
                <label>{translations.newPassword[language]}</label>
                <input type="password" value={newPassword} onChange={(e) => handleInputChange("newPasswordInput", e.target.value)}/>
                <label>{translations.confirmPassword[language]}</label>
                <input type="password" value={repeatedPassword} onChange={(e) => handleInputChange("repeatedPasswordInput", e.target.value)}/>
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
