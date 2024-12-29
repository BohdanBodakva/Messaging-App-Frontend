import React, {useEffect, useState} from "react";
import "./Profile.css";
import {useNavigate} from "react-router-dom";
import {useLanguage} from "../../providers/translations/LanguageProvider";
import {translations} from "../../providers/translations/translations";
import settings_svg from '../../images/settings_button.svg';
import back_button_svg from "../../images/back_button.svg";
import signout_button_svg from "../../images/signout.svg";
import getDefaultProfilePhotoLink from "../../constants/defaultPhotoLinks";

function Profile({ currentUser, setCurrentUser, onBack }) {
    const { language } = useLanguage();

    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const [nameInput, setNameInput] = useState("");
    const [surnameInput, setSurnameInput] = useState("");
    const [usernameInput, setUsernameInput] = useState("");

    const [currentPasswordInput, setCurrentPasswordInput] = useState("");
    const [newPasswordInput, setNewPasswordInput] = useState("");
    const [repeatedPasswordInput, setRepeatedPasswordInput] = useState("");

    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
    const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
    const [isSignOutsModalOpen, setSignOutModalOpen] = useState(false);



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

    const toggleSignOutModal = () => {
        setSignOutModalOpen(!isSignOutsModalOpen);
    };

    function changePassword(){
        togglePasswordModal()
    }

    function saveSettings(){
        toggleSettingsModal()
    }

    function selectNewPhoto(e) {
        const file = e.target.files[0].name;
    }

    return (
        <div className="central-block">
            {currentUser && (
                <div className="inner-block">
                    <div className={`user-settings ${isPasswordModalOpen || isSettingsModalOpen ? "blurred" : ""}`} >
                        <div className="inner-user-settings">
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
                                        <button className="back-button signout-button" onClick={toggleSignOutModal}>
                                            <img src={signout_button_svg} alt={currentUser.username}/>
                                        </button>
                                    </div>
                                </div>
                                <div
                                    className={`profile-photo ${currentUser.profile_photo_link ? "black-border" : ""}`}
                                >
                                    <div className="profile-photo-image">
                                        <img
                                            src={currentUser.profile_photo_link ?
                                                currentUser.profile_photo_link :
                                                getDefaultProfilePhotoLink(currentUser.name)}
                                            alt="User"
                                        />
                                    </div>
                                    <div className="choose-photo">
                                        <input type="file" id="file" className="file-input" onChange={selectNewPhoto}/>
                                        <label htmlFor="file" className="file-label">
                                            <span className="file-icon">
                                                {translations.changeProfilePhoto[language]}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="user-fields">
                                    <label>
                                        <p>{translations.name[language]}</p>
                                        <input
                                            type="text"
                                            value={nameInput}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                        />
                                    </label>
                                    <label>
                                        <p>{translations.surname[language]}</p>
                                        <input
                                            type="text"
                                            value={surnameInput}
                                            onChange={(e) => handleInputChange("surname", e.target.value)}
                                        />
                                    </label>
                                    <label>
                                        <p>{translations.username[language]}</p>
                                        @ <input
                                            type="text"
                                            value={usernameInput}
                                            onChange={(e) => handleInputChange("username", e.target.value)}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="bottom-buttons-part">
                                <div className="setting-buttons">
                                    <div className="change-password">
                                        <button className="save-button" onClick={togglePasswordModal}>
                                            {translations.changePassword[language]}
                                        </button>
                                    </div>
                                    <div className="change-password">
                                        <button className="save-button" onClick={toggleSettingsModal}>
                                            {translations.settings[language]}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="save-btn-container">
                                <button className="save-button save" onClick={saveSettings}>
                                    {translations.save[language]}
                                </button>
                            </div>
                        </div>
                    </div>

                    {isSignOutsModalOpen && (
                        <ConfirmSignOut
                            onClose={toggleSignOutModal}
                        />
                    )}

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

function ConfirmSignOut({ onClose }) {
    const {language} = useLanguage();
    const navigate = useNavigate();

    function signOut() {
        localStorage.removeItem("token");
        localStorage.removeItem("current_user_id");

        navigate("/login");
    }

    return (
        <div className="password-modal">
            <div className="password-modal-content">
                <h3 className="signout-text">{translations.confirmLogout[language]}</h3>
                <button className="save-password-button" onClick={signOut}>
                    {translations.confirm[language]}
                </button>
                <button className="cancel-button" onClick={onClose}>
                    {translations.cancel[language]}
                </button>
            </div>
        </div>
    );
}

function ChangePassword({onClose, handleInputChange, changePassword, currentPassword, newPassword, repeatedPassword}) {
    const {language} = useLanguage();

    return (
        <div className="password-modal">
            <div className="password-modal-content">
                <h3>{translations.changePassword[language]}</h3>
                <label><p>{translations.currentPassword[language]}</p></label>
                <input type="password" value={currentPassword}
                       onChange={(e) => handleInputChange("currentPasswordInput", e.target.value)}/>
                <label><p>{translations.newPassword[language]}</p></label>
                <input type="password" value={newPassword}
                       onChange={(e) => handleInputChange("newPasswordInput", e.target.value)}/>
                <label><p>{translations.confirmPassword[language]}</p></label>
                <input type="password" value={repeatedPassword}
                       onChange={(e) => handleInputChange("repeatedPasswordInput", e.target.value)}/>
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
    const {language} = useLanguage();

    return (
        <div className="password-modal">
            <div className="password-modal-content">
                <div className="settings-section">
                    <h3>{translations.settings[language]}</h3>
                    <div className="label-container">
                        <label>
                            <p>{translations.theme[language]}</p>
                            <select
                                className="custom-dropdown"
                                value={currentUser.theme}
                                onChange={(e) => handleInputChange("theme", e.target.value)}
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                            </select>
                        </label>
                    </div>
                    <div className="label-container">
                        <label className="checkbox-container">
                            <p>{translations.notifications[language]}</p>
                            <input
                                type="checkbox"
                                checked={currentUser.notifications}
                                onChange={(e) =>
                                    handleInputChange("notifications", e.target.checked)
                                }
                            />
                            <span className="checkmark"></span>
                        </label>
                    </div>
                    <div className="label-container">
                        <label>
                            <p>{translations.language[language]}</p>
                            <select
                                value={currentUser.language}
                                onChange={(e) => handleInputChange("language", e.target.value)}
                            >
                                <option value="en">English</option>
                                <option value="ua">Українська</option>
                            </select>
                        </label>
                    </div>
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
