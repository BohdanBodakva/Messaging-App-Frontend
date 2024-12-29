import React from "react";
import "./UserCard.css";
import getDefaultProfilePhotoLink from "../../constants/defaultPhotoLinks";

const UserCard = ({ user, onRemove }) => {

    function removeUser() {
        onRemove(user);
    }

    return (
        <div className="user-card">
            <div className="remove-icon" onClick={removeUser}>
                &times;
            </div>
            <img
                src={user.profile_photo_link ? user.profile_photo_link : getDefaultProfilePhotoLink(user.username)}
                alt={user.username}
                className="user-image"/>
            <p className="username">@{user.username}</p>
        </div>
    );
};

export default UserCard;