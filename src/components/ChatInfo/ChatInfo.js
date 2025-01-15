import React, {useEffect} from "react";
import "./ChatInfo.css";
import {useLanguage} from "../../providers/translations/LanguageProvider";
import {translations} from "../../providers/translations/translations";
import back_button_svg from "../../images/back_button.svg";
import FoundUserItem from "../Chats/FoundUserItem";
import UserCard from "../UserCard/UserCard";

function ChatInfo({ socket, currentUser, selectedChat, selectChat, onBack }) {
    const { language } = useLanguage();

    useEffect(() => {

    }, [])

    const isGroup = selectedChat.isGroup;

    let chatName;
    let otherUser = null;
    let isAdmin = false;
    if (isGroup) {
        chatName = selectedChat.name;

        isAdmin = selectedChat.adminId && selectedChat.adminId === currentUser.id;
    } else {
        otherUser = selectedChat.users.filter(u => u.id !== currentUser.id)[0];

        chatName = `${otherUser.name} ${otherUser.surname}`;
    }

    function openPrivateChat() {
        onBack();
        selectedChat(selectedChat.id);
    }

    function deleteChat() {
        onBack();

        socket.emit("delete_chat", {"chat_id": selectedChat.id});
    }

    function removeUserFromChat(userId) {
        
    }


    return (
        <div className="central-block1">
            {currentUser && (
                <div className="inner-block">
                    <div className="user-settings" >
                        <div className="inner-user-settings1">
                            <div className="profile-section">
                                <div className="profile-header1">
                                    <div className="go-back">
                                        <button className="back-button" onClick={onBack}>
                                            <img src={back_button_svg} alt={currentUser.username}
                                                 className="back-button-image"/>
                                        </button>
                                    </div>
                                    <div className="go-back">
                                        <div className="right-empty-block"></div>
                                    </div>
                                </div>
                                <div
                                    className={`group-photo ${currentUser.profile_photo_link ? "black-border" : ""}`}
                                >
                                    <div className={`group-photo-image ${!selectedChat ? "black-border" : ""}`}>
                                        <img
                                            src={selectedChat.chatPhotoLink}
                                            alt="User"
                                        />
                                    </div>
                                </div>
                                <h2>{chatName}</h2>
                                {!isGroup && otherUser && (
                                    <p className="chat-info-username">@{otherUser.username}</p>
                                )}
                            </div>
                            <div className="save-btn-container1">
                                <div className="save-btn-inner">
                                    {isGroup && selectedChat.users.map(u => {
                                        console.log(selectedChat)

                                        return (
                                            <UserCard
                                                key={u.id}
                                                user={u}
                                                onRemove={isAdmin ? () => {} : null}
                                            />
                                        )
                                    }) }
                                    <button className="save-button save1 delete-btn" onClick={deleteChat}>
                                        {translations.deleteChat[language]} 🗑
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatInfo;
