import React, { useState } from "react";
import './Chats.css';
import user_svg from '../../images/user.svg';

function FoundUserItem ({ user, onClick }) {

    return (
        <div className="chat-item" onClick={onClick}>
            <img src={user.profile_photo_link ? user.profile_photo_link : user_svg}
                 alt={user.username} className="chat-photo" />
            <div className="chat-info">
                <div className="chat-info-header">
                    <h4>{user.name} {user.surname}</h4>
                    <p>@{user.username}</p>
                </div>
            </div>
        </div>
    );
}


export default FoundUserItem;
