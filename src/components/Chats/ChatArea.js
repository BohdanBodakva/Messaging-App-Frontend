import React, {use, useState} from "react";
import './Chats.css';
import back_button_svg from "../../images/back_button.svg";
import user_svg from "../../images/user.svg";
import group_svg from "../../images/group.svg";
import Message from "./Message";

function ChatArea ({ currentUser, chat, onBack }) {



    const chatUsers = chat.users;
    const otherUsers = chatUsers.filter((user) => user.id !== currentUser.id);

    const isGroup = otherUsers.length > 2;

    let chatPhoto = user_svg
    let chatName;
    if (isGroup) {
        chatName = chat.name;
        const groupPhoto = chat.chat_photo_link
        if (!groupPhoto) {
            chatPhoto = group_svg
        } else {
            chatPhoto = groupPhoto
        }
    } else {
        const secondUser = otherUsers[0]

        chatName = secondUser.name
        if (secondUser.profile_photo_link) {
            chatPhoto = secondUser.profile_photo_link
        }
    }

    return (
        <div className="chat-details">
            <div className="chat-header">
                <button className="back-button" onClick={onBack}>
                    <img src={back_button_svg} alt={chat.name} className="back-button-image"/>
                </button>
                <div>
                    <h2>{chatName}</h2>
                    {!isGroup && (
                        <div className="username-header">
                            <p>@{otherUsers[0].username}</p>
                        </div>
                    )}
                </div>
                <img src={chatPhoto} alt="chat-photo" className="chat-photo chat-header-photo"/>
            </div>
            <div className="messages">
                {chat.messages.map((message) => {
                    const sendByCurrentUser = message.user_id === currentUser.id;

                    let senderPhoto = user_svg;
                    let senderName;
                    if (!sendByCurrentUser) {
                        const user = otherUsers.filter((otherUser) => otherUser.id === message.user_id)[0];
                        if (user) {
                            senderName = user.name;
                            const userPhoto = user.profile_photo_link
                            if (userPhoto){
                                senderPhoto = userPhoto
                            }
                        }
                    }

                    return (
                        <Message
                            key={message.id}
                            message={message}
                            isGroup={isGroup}
                            senderName={senderName}
                            sendByCurrentUser={sendByCurrentUser}
                            senderPhoto={senderPhoto}
                        ></Message>
                    )
                })}
            </div>
            <div className="message-input">
                <input type="text" placeholder="Type a message..." />
                <button>Send</button>
            </div>
        </div>
    );
}


export default ChatArea;
