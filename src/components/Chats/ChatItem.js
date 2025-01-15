import React, {useEffect, useState} from "react";
import './Chats.css';
import group_svg from "../../images/group.svg";
import group2_svg from "../../images/group2.svg";
import {translations} from "../../providers/translations/translations";
import {useLanguage} from "../../providers/translations/LanguageProvider";
import {getFormattedDate} from "../../constants/formattedDate";

function ChatItem ({ currentUser, displayedChats, chat, selectedChat, onClick }) {
    const {language} = useLanguage();

    const [unreadMessages, setUnreadMessages] = useState(false);
    useEffect(() => {
        if (selectedChat && selectedChat.id === chat.id) {
            setUnreadMessages(false);
        }
    }, [selectedChat])

    const currChat = displayedChats.filter((c) => c.id === chat.id)[0];
    const chatUsers = currChat.users;
    const otherUsers = chatUsers.filter((user) => user.id !== currentUser.id);

    const isGroup = chat.isGroup;

    let chatPhoto = currentUser.profilePhotoLink;
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

        chatName = `${secondUser.name} ${secondUser.surname}`
        if (secondUser.profile_photo_link) {
            chatPhoto = secondUser.profile_photo_link
        }
    }

    const [firstRender, setFirstRender] = useState(true);

    useEffect(() => {
        const hasUnreadMessages = currentUser.unreadMessages &&
            currentUser.unreadMessages.filter(
                (m) => m.chatId === chat.id && m.usersThatUnread.includes(currentUser.id)
            ).length > 0;

        setUnreadMessages(hasUnreadMessages);
    }, []);

    useEffect(() => {
        if (firstRender) {
            setFirstRender(false);
            return;
        }

        if (chat.id === displayedChats[0].id) {
            if ((selectedChat && chat.id !== selectedChat.id) || (!selectedChat)) {
                setUnreadMessages(true);
            }
        }

    }, [displayedChats]);

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
            <div className="message-right-part">
                {chat.messages.length > 0 && (
                    <div className="message-right-part-inner">
                        <div className="last-chat-message">
                            <div className="ellipsis-block">
                                {chat.messages[chat.messages.length - 1].text}
                            </div>
                            <div className="msg-time-block">
                                <span className={`message-time}`}>
                                    {getFormattedDate(chat.messages[chat.messages.length - 1].sendAt, language)}
                                </span>
                            </div>
                        </div>
                        {
                            unreadMessages && (
                                <div className="point-1-block">
                                    <div className="point-size-1">
                                        <div className="blue-point"></div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                )}
            </div>
        </div>
    );
}


export default ChatItem;
