import React, { useState } from "react";
import './Chats.css';

function ChatItem ({ chat, isSelected, onClick }) {

    return (
        <div
            className={`chat-item ${isSelected ? "selected" : ""}`}
            onClick={onClick}
        >
            <h4>{chat.name}</h4>
            <p>{chat.lastMessage}</p>
        </div>
    );
}


export default ChatItem;
