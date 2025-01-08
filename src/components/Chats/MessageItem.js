import React, {useEffect, useState} from "react";
import './Chats.css';
import {useLanguage} from "../../providers/translations/LanguageProvider";
import {translations} from "../../providers/translations/translations";
import {getFormattedDate} from "../../constants/formattedDate";

function MessageItem ({ socket, newMessage, loadChatHistory, message, chatId, prevDayMessageBorder, prevDayMessageText, sendByCurrentUser, senderName, senderPhoto }) {
    const { language } = useLanguage();

    const [deleteMenu, setDeleteMenu] = useState(null);

    const handleContextMenu = (event) => {
        event.preventDefault();
        setDeleteMenu({ x: event.clientX, y: event.clientY });
    };

    const handleClick = () => {
        setDeleteMenu(null);
    };

    useEffect(() => {
        window.addEventListener("click", handleClick);
        window.addEventListener("scroll", handleClick);

        return () => {
            window.removeEventListener("click", handleClick);
            window.removeEventListener("scroll", handleClick);
        };
    }, []);

    function deleteMessage(messageId) {

        socket.emit(
            "delete_message",
            {
                "message_id": messageId,
                "room": chatId
            }
        )

    }


    return (
        <>
            {prevDayMessageText && !loadChatHistory && (
                <div className="next-day-message-text">
                    <span className="next-day-message-border-text">
                        {prevDayMessageText}
                    </span>
                </div>
            )}

            {prevDayMessageBorder && (
                <div className="next-day-message-border">
                    <span className="next-day-message-border-msg">
                        {getFormattedDate(message.sendAt, language).split(',')[0]}
                    </span>
                </div>
            )}

            {newMessage && (
                <div className="new-message-border">
                    <span className="new-message-border-msg">
                        {translations.newMessages[language]}
                    </span>
                </div>
            )}

            <div onClick={handleClick} className={`message ${sendByCurrentUser ? "sent" : "received"}`}>
                {!sendByCurrentUser && (
                    <img
                        src={senderPhoto}
                        alt={message.id}
                        className={`message-photo ${senderPhoto ? "black-border" : ""}`}
                    />
                )}
                <div onContextMenu={sendByCurrentUser ? handleContextMenu : null} className="message-content">
                    {!sendByCurrentUser && <h5>{senderName}</h5>}
                    <pre><p>{message.text}</p></pre>
                    <span
                        className={`message-time ${sendByCurrentUser ? "sent-time" : ""}`}>
                    {getFormattedDate(message.sendAt, language)}
                </span>
                </div>

                {deleteMenu && (
                    <ul className="delete-menu-container" style={{top: deleteMenu.y, left: deleteMenu.x}}>
                        <li className="delete-menu">
                            <button onClick={() => deleteMessage(message.id)}>
                                <h5>{translations.delete[language]} 🗑</h5>️
                            </button>
                        </li>
                    </ul>
                )}
            </div>
        </>
    );
}


export default MessageItem;
