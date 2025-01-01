import React, { useState } from "react";
import './Chats.css';
import group_svg from "../../images/group.svg";
import group2_svg from "../../images/group2.svg";
import getDefaultProfilePhotoLink from "../../constants/defaultPhotoLinks";
import {translations as otherUser, translations} from "../../providers/translations/translations";
import {useLanguage} from "../../providers/translations/LanguageProvider";
import {getFormattedDate} from "../../constants/formattedDate";

function ChatItem ({ currentUser, chat, selectedChat, onClick }) {
    const {language} = useLanguage();

    const chatUsers = chat.users;
    const otherUsers = chatUsers.filter((user) => user.id !== currentUser.id);

    const isGroup = chat.is_group;

    let chatPhoto = getDefaultProfilePhotoLink(currentUser.name)
    let chatName;
    let secondUser;

    if (isGroup) {
        chatName = chat.name ? chat.name : translations.newGroup[language];
        const groupPhoto = chat.chat_photo_link
        if (!groupPhoto) {
            chatPhoto = group_svg
        } else {
            chatPhoto = groupPhoto
        }
    } else {
        secondUser = otherUsers[0]

        chatName = `${secondUser.name} ${secondUser.surname}`
        if (secondUser.profile_photo_link) {
            chatPhoto = secondUser.profile_photo_link
        }
    }

    return (
        <div
            className={`chat-item ${selectedChat && selectedChat.id === chat.id ? "selected" : ""}`}
            onClick={onClick}
        >
            <img
                src={chatPhoto}
                alt={chat.name}
                className={`chat-photo ${currentUser.profile_photo_link ? "black-border" : ""}`}
            />
            <div className="chat-info">
                <div className="chat-info-header">
                    <h4>{chatName}</h4>
                    {isGroup ? (
                        <div className="chat-info-header-img-box">
                            <img src={group2_svg} alt="group-icon"/>
                        </div>
                    ) : (
                        <p>(@{secondUser.username})</p>
                    )}
                </div>
                <div className="status">
                    <div className="point-size">
                        <div className="green-point"></div>
                    </div>
                    <p className="user-status">
                        {translations.online[language]}
                    </p>
                </div>
            </div>
            <div className="message-right-part ellipsis-block">
                {chat.messages.length > 0 && (
                    <div>
                        <p>{chat.messages[chat.messages.length - 1].text}</p>
                        <span className={`message-time}`}>
                            {getFormattedDate(chat.messages[chat.messages.length - 1].send_at, language)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}


export default ChatItem;
