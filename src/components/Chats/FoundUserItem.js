import React from "react";
import './Chats.css';
import getDefaultProfilePhotoLink from "../../constants/defaultPhotoLinks";

function FoundUserItem ({ user, onClick }) {

    return (
        <div className="chat-item" onClick={onClick}>
            <img src={user.profile_photo_link ?
                user.profile_photo_link :
                getDefaultProfilePhotoLink(user.name)}
                 alt={user.username}
                 className={`chat-photo ${user.profile_photo_link ? "black-border" : ""}`}
            />
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
