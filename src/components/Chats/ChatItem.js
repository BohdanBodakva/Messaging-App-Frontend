import React, { useState } from "react";
import './Chats.css';
import user_svg from '../../images/user.svg';

function ChatItem ({ chat, isSelected, onClick }) {

    return (
        <div
            className={`chat-item ${isSelected ? "selected" : ""}`}
            onClick={onClick}
        >
            <img src={chat.is_group === "True" ? chat.photo : user_svg} alt={chat.name} className="chat-photo" />
            <div className="chat-info">
                <h4>{chat.name}</h4>
                <p className="chat-status">{chat.status}</p>
                <p className="chat-last-message">{chat.lastMessage}</p>
            </div>
            <div className="chat-time">{chat.lastSeen}</div>
        </div>
    );
}


export default ChatItem;
