import React, { useState } from "react";
import './Chats.css';
import ChatItem from "./ChatItem";
import ChatArea from "./ChatArea";

function Chats () {
    const [selectedChat, setSelectedChat] = useState(null);
    const chats = [
        { id: 1, name: "Alice", lastMessage: "Hello!" },
        { id: 2, name: "Bob", lastMessage: "What's up?" },
        { id: 3, name: "Charlie", lastMessage: "See you soon." },
    ];

    return (
        <div className="app">
            <div className="chats-bar">
                {chats.map((chat) => (
                    <ChatItem
                        key={chat.id}
                        chat={chat}
                        isSelected={selectedChat === chat.id}
                        onClick={() => setSelectedChat(chat.id)}
                    />
                ))}
            </div>
            <div className="chat-area">
                {selectedChat ? (
                    <ChatArea chat={chats.find((chat) => chat.id === selectedChat)}/>
                ) : (
                    <div className="no-chat">Select a chat to start messaging</div>
                )}
            </div>
        </div>
    );
}


export default Chats;
