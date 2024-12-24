import React, { useState } from "react";
import './Chats.css';

function ChatArea ({ chat }) {

    return (
        <div className="chat-details">
            <h2>Chat with {chat.name}</h2>
            <div className="messages">
                <p><strong>{chat.name}:</strong> {chat.lastMessage}</p>
                <p><strong>You:</strong> Got it!</p>
            </div>
            <div className="message-input">
                <input type="text" placeholder="Type a message..."/>
                <button>Send</button>
            </div>
        </div>
    );
}


export default ChatArea;
