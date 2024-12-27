import React, { useState } from "react";
import './Chats.css';
import user_svg from '../../images/user.svg';
import group_svg from "../../images/group.svg";

function ChatItem ({ currentUser, chat, selectedChat, onClick }) {

    const chatUsers = chat.users;
    const otherUsers = chatUsers.filter((user) => user.id !== currentUser.id);

    const isGroup = otherUsers.length > 2;

    let chatPhoto = user_svg
    let chatName;
    let secondUser;

    if (isGroup) {
        chatName = chat.name;
        const groupPhoto = chat.chat_photo_link
        if (!groupPhoto) {
            chatPhoto = group_svg
        } else {
            chatPhoto = groupPhoto
        }
    } else {
        secondUser = otherUsers[0]

        chatName = secondUser.name
        if (secondUser.profile_photo_link) {
            chatPhoto = secondUser.profile_photo_link
        }
    }

    return (
        <div
            className={`chat-item ${selectedChat && selectedChat.id === chat.id ? "selected" : ""}`}
            onClick={onClick}
        >
            <img src={chatPhoto} alt={chat.name} className="chat-photo" />
            <div className="chat-info">
                <div className="chat-info-header">
                    <h4>{chatName}</h4>
                    {!isGroup && (
                        <p>(@{secondUser.username})</p>
                    )}
                </div>
                <div className="chat-info-message">
                    <p></p>
                    <p></p>
                </div>
                <p className="chat-status">{chat.status}</p>
            </div>
        </div>
    );
}


export default ChatItem;
