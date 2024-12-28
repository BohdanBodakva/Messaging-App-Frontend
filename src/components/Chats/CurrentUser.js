import React, {use, useState} from "react";
import './Chats.css';
import user_svg from '../../images/user.svg';
import settings_svg from '../../images/settings_button.svg';
import {useNavigate} from "react-router-dom";

function CurrentUser ({ user, displayUserProfile }) {
    const navigate = useNavigate();

    return (
        <div className="current-user">
            <img
                src={user.profile_photo_link ? user.profile_photo_link : user_svg}
                alt={user.username}
                className="user-photo"
            />
            <div className="user-info">
                <h4>{user.name}</h4>
                <p>online</p>
            </div>
            <button className="settings-button" onClick={displayUserProfile}>
                <img src={settings_svg} alt="settings" className="chat-photo"/>
            </button>
        </div>
    );
}


export default CurrentUser;
