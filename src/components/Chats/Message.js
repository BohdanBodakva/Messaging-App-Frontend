import React, {useEffect, useState} from "react";
import './Chats.css';
import { parse } from 'date-fns';
import {str} from "ajv";

function Message ({ isGroup, message, sendByCurrentUser, senderName, senderPhoto }) {
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

    function getFormattedDate(stringDate){
        const todayDate = new Date();
        const sendDate = new Date(stringDate)

        const time = `${sendDate.getHours()}:${sendDate.getMinutes()}`;

        const isToday = (sendDate.getDate() === todayDate.getDate()) &&
            (sendDate.getMonth() === todayDate.getMonth()) &&
            (sendDate.getFullYear() === todayDate.getFullYear());
        if (isToday) {
            return `Today, ${time}`
        }

        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        const isYesterday = (sendDate.getDate() === yesterday.getDate()) &&
            (sendDate.getMonth() === yesterday.getMonth()) &&
            (sendDate.getFullYear() === yesterday.getFullYear());
        if (isYesterday) {
            return `Yesterday, ${time}`
        }

        const date = `${sendDate.getDate()}.${sendDate.getMonth() + 1}`;

        const isCurrentYear = sendDate.getFullYear() === todayDate.getFullYear();
        if (isCurrentYear) {
            return `${date}, ${time}`
        } else {
            return `${date}.${sendDate.getFullYear()}, ${time}`
        }
    }

    function deleteMessage(messageId) {

    }


    return (
        <div onClick={handleClick} className={`message ${sendByCurrentUser ? "sent" : "received"}`}>
            {(!sendByCurrentUser && !isGroup) && (
                <img src={senderPhoto} alt={message.id} className="message-photo" />
            )}
            <div onContextMenu={sendByCurrentUser ? handleContextMenu : null} className="message-content">
                {!sendByCurrentUser && <h5>{senderName}</h5>}
                <p>{message.text}</p>
                <span className={`message-time ${sendByCurrentUser ? "sent-time" : ""}`}>{getFormattedDate(message.send_at)}</span>
            </div>

            {deleteMenu && (
                <ul className="delete-menu-container" style={{top: deleteMenu.y, left: deleteMenu.x}}>
                    <li className="delete-menu">
                        <button onClick={deleteMessage(message.id)}>
                            <h5>Delete 🗑</h5>️
                        </button>
                    </li>
                </ul>
            )}
        </div>
    );
}


export default Message;
