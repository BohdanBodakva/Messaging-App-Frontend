import React from "react";
import './Chats.css';
import settings_svg from '../../images/settings_button.svg';

function CurrentUser ({ user, displayUserProfile }) {

    return (
        <div className="current-user">
            <img
                src={user.profilePhotoLink}
                alt={user.username}
                className={`user-photo ${user.profile_photo_link ? "black-border" : ""}`}
            />
            <div className="user-info">
                <h4>{user.name} {user.surname}</h4>
                <p>online</p>
            </div>
            <button className="settings-button" onClick={displayUserProfile}>
                <img src={settings_svg} alt="settings" className="chat-photo"/>
            </button>
        </div>
    );
}


export default CurrentUser;
