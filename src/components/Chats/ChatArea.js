import React, {use, useEffect, useRef, useState} from "react";
import './Chats.css';
import back_button_svg from "../../images/back_button.svg";
import user_svg from "../../images/user.svg";
import group_svg from "../../images/group.svg";
import Message from "./Message";
import PreviewFiles from "./PreviewFiles";
import LoadingSpinner from "../Spinner/LoadingSpinner";
import {useLanguage} from "../../providers/translations/LanguageProvider";
import {translations} from "../../providers/translations/translations";

function ChatArea ({ loading, currentUser, chat, onBack, messageList, setMessageList }) {
    const { language } = useLanguage();

    const [messageText, setMessageText] = useState("");

    const containerRef = useRef(null);
    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    };

    const [previewFiles, setPreviewFiles] = useState([]);

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

    function sendMessage() {

        if (!messageText) {
            return;
        }

        const newMessage = {
            "chat_id": chat.id,
            "user_id": currentUser.id,
            "is_read": false,
            "send_at": new Date(),
            "senf_files": [],
            "text": messageText,
            "id": Math.random()
        }

        setMessageList(messageList.concat(newMessage));

        containerRef.current.scrollTop = containerRef.current.scrollHeight;

        setMessageText("")
        setPreviewFiles([])
    }

    const handleFileChange = (event) => {
        setPreviewFiles(Array.from(event.target.files)); // Convert FileList to Array
    };


    useEffect(() => {
        setMessageText('');
        setPreviewFiles([]);

        scrollToBottom()
    }, [messageList]);


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
            <div className="messages scrollable" ref={containerRef} style={{position: 'relative'}} >
                {loading && <LoadingSpinner  />}

                {messageList.map((message) => {
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
            {previewFiles.length > 0 &&
                <div className="preview scrollable">
                    <PreviewFiles files={previewFiles}/>
                </div>
            }
            <div className="message-input">
                <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Enter a message..."
                    rows="4"
                    cols="50">
                </textarea>
                <input type="file" id="file" className="file-input" onChange={handleFileChange} multiple/>
                <label htmlFor="file" className="file-label">
                    <span className="file-icon">📁</span>
                </label>
                <button onClick={sendMessage}>
                    {translations.send[language]}
                </button>
            </div>
        </div>
    );
}


export default ChatArea;
