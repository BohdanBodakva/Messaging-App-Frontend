import React, {useEffect, useRef, useState} from "react";
import './Chats.css';
import back_button_svg from "../../images/back_button.svg";
import clip_svg from "../../images/clip.svg";
import PreviewFiles from "./PreviewFiles";
import {useLanguage} from "../../providers/translations/LanguageProvider";
import {translations} from "../../providers/translations/translations";
import {Message} from "../../models/Message";
import MessageItem from "./MessageItem";
import type {User} from "../../models/User";
import {isNextDay} from "../../constants/formattedDate";

function ChatArea ({ socket, setLoadChatHistory, loadChatHistory, offset, loadedHistoryItemsCount, currentChatHistory, setCurrentChatHistory, currentUser, chat, onBack }) {
    const { language } = useLanguage();

    const [messageText, setMessageText] = useState("");

    const [scrollbarIsAtTop, setScrollbarIsAtTop] = useState(false);


    const containerRef = useRef(null);
    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    };



    const [previewFiles, setPreviewFiles] = useState([]);

    const chatUsers = currentUser.chats.filter(c => c.id === chat.id)[0].users;
    const otherUsers = chatUsers.filter((user) => user.id !== currentUser.id);




    const selectedChat = currentUser.chats.filter(c => c.id === chat.id)[0];
    const isGroup = selectedChat.isGroup



    let chatName;
    if (isGroup) {
        chatName = selectedChat.name;
    } else {
        const secondUser = otherUsers[0]
        chatName = `${secondUser.name} ${secondUser.surname}`
    }

    function sendMessage() {
        if (!messageText) {
            return;
        }

        socket.emit(
            "send_message",
            {
                "user_id": currentUser.id,
                "text": messageText,
                "sent_files": [],
                "send_at": new Date(),
                "room": chat.id,
            }
        )

        setMessageText("")
        setPreviewFiles([])
    }

    const handleFileChange = (event) => {
        setPreviewFiles(Array.from(event.target.files)); // Convert FileList to Array
    };



    useEffect(() => {

        const handleScroll = () => {
            if (containerRef.current) {
                const scrollTop = containerRef.current.scrollTop;
                setScrollbarIsAtTop(scrollTop === 0);

                const hasScrollbar = containerRef.current.scrollHeight > containerRef.current.clientHeight;

                if (scrollTop === 0 && hasScrollbar && loadChatHistory) {

                    socket.emit(
                        "load_chat_history",
                        {
                            "chat_id": chat.id,
                            "items_count": loadedHistoryItemsCount,
                            "offset": offset
                        }
                    )

                    setLoadChatHistory(true);


                }
            }
        };

        // If scrollbar is at the top point
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }

        socket.on("send_message", (data) => {
            const message = Message.fromJson(data.message);
            const room = Number(data.room);

            if (currentChatHistory.length === 0 || room === chat.id) {
                setCurrentChatHistory(prevState => [...prevState, message]);
            } else {

            }
        })

        socket.on("delete_message", (data) => {
            const messageId = Number(data.message_id);
            const chatId = Number(data.chat_id);

            if (chat.id === chatId) {
                setCurrentChatHistory(prevState => {
                    return prevState.filter((m) => m.id !== messageId);
                })
            }
        })

        scrollToBottom()

        // currentChatHistory.map((m) => {
        //     console.log(m.id)
        // })

        return () => {
            socket.off("send_message");

            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        }
    },
        // [chat, offset, loadChatHistory, currentChatHistory])
        [offset, loadChatHistory, currentChatHistory])
    ;

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
                <img
                    src={chat.chatPhotoLink}
                    alt="chat-photo"
                    className={`chat-photo chat-header-photo ${currentUser.profile_photo_link ? "black-border" : ""}`}
                />
            </div>
            <div className="messages scrollable" ref={containerRef} style={{position: 'relative'}} >
                {currentChatHistory.map((message: Message, idx, elements) => {
                    const sendByCurrentUser = message.userId === currentUser.id;

                    let senderName;
                    if (!sendByCurrentUser) {
                        const user: User = otherUsers.filter((otherUser) => otherUser.id === message.userId)[0];
                        if (user) {
                            senderName = `${user.name} ${user.surname}`;
                        }
                    }

                    let prevDayMessageBorder;
                    let prevDayMessageText = null;
                    try {
                        if (idx === 0) {
                            prevDayMessageText = translations.startOfTheChat[language];
                            prevDayMessageBorder = true;
                        } else {
                            const prevMessageItem: Message = elements[idx - 1];

                            if (isNextDay(message.sendAt, prevMessageItem.sendAt)) {
                                prevDayMessageBorder = true;
                            }
                        }
                    } catch (err) {
                        prevDayMessageBorder = false;
                    }

                    return (
                        <MessageItem
                            key={idx}
                            socket={socket}
                            message={message}
                            isGroup={isGroup}
                            loadChatHistory={loadChatHistory}
                            chatId={chat.id}
                            senderName={senderName}
                            prevDayMessageText={prevDayMessageText}
                            sendByCurrentUser={sendByCurrentUser}
                            prevDayMessageBorder={prevDayMessageBorder}
                            senderPhoto={currentUser.profilePhotoLink}
                        ></MessageItem>
                    )
                })}
            </div>
            <div className="margin-block"></div>
            {previewFiles.length > 0 &&
                <div className="preview scrollable">
                    <PreviewFiles files={previewFiles}/>
                </div>
            }
            <div className="message-input">
            <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={`${translations.enterMessage[language]}...`}
                rows="4"
                cols="50">
            </textarea>
                <input type="file" id="file" className="file-input" onChange={handleFileChange} multiple/>
                <label htmlFor="file" className="file-label">
                    <span className="file-icon">
                        <img src={clip_svg} alt="clip-icon"/>
                    </span>
                </label>
                <button onClick={sendMessage}>
                    {translations.send[language]}
                </button>
            </div>
        </div>
    );
}


export default ChatArea;
