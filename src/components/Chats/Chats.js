import React, {use, useEffect, useRef, useState} from "react";
import './Chats.css';
import ChatItem from "./ChatItem";
import ChatArea from "./ChatArea";
import CurrentUser from "./CurrentUser";
import {useNavigate} from "react-router-dom";
import makeRequest, {refreshAccessToken} from "../../logic/HttpRequests";
import FoundUserItem from "./FoundUserItem";
import {useLanguage} from "../../providers/translations/LanguageProvider";
import {translations} from "../../providers/translations/translations";
import Profile from "../Profile/Profile";
import AddGroup from "../AddGroup/AddGroup";
import {socket} from "../../logic/WebSocket";
import {User} from "../../models/User";
import {Message} from "../../models/Message";
import {Chat} from "../../models/Chat";

const loadedHistoryItemsCount = 5;

function Chats ({ currentUser, setCurrentUser }) {
    const currentUserRef = useRef(currentUser);
    useEffect(() => {
        currentUserRef.current = currentUser;
    }, [currentUser]);


    const { language } = useLanguage();

    const navigate = useNavigate();

    const[isUserProfileDisplayed, setIsUserProfileDisplayed] = useState(false);
    const[isAddGroupDisplayed, setIsAddGroupDisplayed] = useState(false);

    const [displayedChats, setDisplayedChats] = useState([]);

    const [foundUsersInput, setFoundUsersInput] = useState("");
    const [foundUsers, setFoundUsers] = useState([]);

    const [currentChatHistory, setCurrentChatHistory] = useState([]);
    const [loadChatHistory, setLoadChatHistory] = useState(true);
    const [offset, setOffset] = useState(0);

    const [loading, setLoading] = useState(false);

    const [selectedChat, setSelectedChat] = useState(null);

    function selectChat(chat_id) {
        const chat = currentUserRef.current.chats.filter((c) => c.id === chat_id)[0];

        if (chat && (selectedChat ? selectedChat.id !== chat.id : true)) {
            setLoadChatHistory(true);
            setOffset(0);
            setCurrentChatHistory([]);
            setSelectedChat(chat);

            socket.emit(
                "load_chat_history",
                {
                    "chat_id": chat_id,
                    "items_count": loadedHistoryItemsCount,
                    "offset": 0
                }
            )
        } else {
            setOffset(0)
        }


    }

    // const [socketConnection, setSocketConnection] = useState(null);

    useEffect(() => {
        setLoading(true);

        const accessToken = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");

        if (!accessToken || !refreshToken) {
            navigate("/login");
            return;
        }



        // =============================================================================





        socket.on("join_room", (data) => {
            const room = data.room;
        })

        socket.on("load_user", (data) => {
            const userJson = data.user;
            const user = User.fromJson(userJson);

            setCurrentUser(user);

            setDisplayedChats(user.chats);

            user.chats.forEach((c) => {
                socket.emit(
                    "join_room",
                    {
                        "room": c.id,
                    }
                )
            })


        })

        socket.on("load_user_error", (data) => {
            console.log(data);
            socket.disconnect();
            navigate("/login");
        })

        socket.on("load_chat_history", (data) => {


            const chatId = Number(data.chat_id);
            const isEnd = Boolean(data.is_end);
            const messages = data.chat_history ?
                data.chat_history.map(m => Message.fromJson(m)) : [];

            console.log(`LLL, offset=${offset}, isEnd=${isEnd}`);

            if (isEnd) {
                setLoadChatHistory(false);
            }

            if (messages.length > 0) {
                setCurrentChatHistory(prevState => [...messages, ...prevState]);
                setOffset(prevState => prevState + loadedHistoryItemsCount);
            }




        })

        socket.on("validate_refreshed_token", (data) => {
            const user_id = data.user_id;

            socket.emit(
                "load_user",
                {
                    "user_id": user_id,
                    "load_messages": true
                }
            )
        })

        socket.on("validate_refreshed_token_error", (data) => {
            currentUser.chats.forEach((c) => {
                socket.emit(
                    "leave_room",
                    {
                        "room": c.id,
                    }
                )
            })

            socket.disconnect();
            navigate("/login");
        })

        socket.on("validate_token", (data) => {
            const user_id = data.user_id;

            socket.emit(
                "load_user",
                {
                    "user_id": user_id,
                    "load_messages": false
                }
            )
        })

        socket.on("validate_token_error", (data) => {
            if (data.error.includes("Signature has expired")) {
                // refresh access_token
                console.log("let's go and refresh");
                let newAccessToken = null;
                (async function() {
                    try {
                        newAccessToken = await refreshAccessToken();

                        socket.emit(
                            "validate_refreshed_token",
                            {"access_token": newAccessToken}
                        );
                    } catch (error) {
                        currentUser.chats.forEach((c) => {
                            socket.emit(
                                "leave_room",
                                {
                                    "room": c.id,
                                }
                            )
                        })

                        socket.disconnect();
                        navigate("/login");
                    }
                })();
            } else {
                currentUser.chats.forEach((c) => {
                    socket.emit(
                        "leave_room",
                        {
                            "room": c.id,
                        }
                    )
                })

                socket.disconnect();
                navigate("/login");
            }
        })

        socket.on("create_chat", (data) => {
            const currentUserId = Number(data.current_user_id);
            const user = User.fromJson(data.user);
            const chat = Chat.fromJson(data.chat);
            console.log("a CHAT => ", chat)

            const currentChatIds = currentUserRef.current.chats.map(c => c.id);

            console.log("C C I ===> ", currentChatIds)

            if (currentUserRef.current.id === currentUserId) {

                console.log("I CREATED CHAT")

                if (!currentChatIds.includes(chat.id)) {

                    setCurrentUser(prev => {
                        prev.chats.push(chat);
                        return prev;
                    });

                    // setDisplayedChats(prev => [...prev, chat])
                } else {

                }

                socket.emit("join_room", { "room": chat.id });

                selectChat(chat.id)
                clearFoundUsersInput()

            }
            else if (currentUserRef.current.id === user.id) {

                console.log("CREATED CHAT WITH ME")


                if (!currentChatIds.includes(chat.id)) {

                    setCurrentUser(prev => {
                        prev.chats.push(chat);
                        return prev;
                    });

                    // setDisplayedChats(prev => [...prev, chat])
                } else {

                }

                socket.emit("join_room", { "room": chat.id });

                clearFoundUsersInput()
            }
        })

        // =============================================================================

        socket.connect();

        socket.emit(
            "validate_token",
            {"access_token": localStorage.getItem("access_token")}
        );

        setLoading(false);

        return () => {
            socket.disconnect();
            socket.close();
            console.log("Socket disconnected from cleanup");
        };
    }, []);

    async function searchUsers(event) {
        const text = event.target.value

        setFoundUsersInput(text)

        if (text !== "") {
            const url = `/users/username/contains/${text}`;
            const response = await makeRequest("GET", url);

            setFoundUsers(response.response.data.users)
        } else {
            setFoundUsers([])
        }
    }


    function clearFoundUsersInput() {
        setFoundUsersInput("")
        setFoundUsers([])
    }

    function startNewChat(user) {
        socket.emit(
            "create_chat",
            {
                "current_user_id": currentUser.id,
                "user_id": user.id,
                "created_at": new Date()
            }
        )
    }

    function createGroup(user) {

    }

    function closeProfileWindow () {
        setIsUserProfileDisplayed(false);
    }

    function displayAddGroupWindow () {
        setIsAddGroupDisplayed(true);
    }

    function closeChatArea() {
        setSelectedChat(null);
        setCurrentChatHistory([]);
        setOffset(0);
    }

    function closeAddGroupWindow () {
        setIsAddGroupDisplayed(false);
    }

    function moveChatToTop() {
        const selectedChatId = selectedChat.id;

        // setDisplayedChats(prev => {
        //     return prev.filter(c => c.id !== selectedChatId).push(selectedChat);
        //
        // })

    }

    return (
        <div className="main-app-block" style={{position: "relative"}}>
            {isUserProfileDisplayed && (
                <div className="displayed-user-profile">
                    <Profile
                        socket={socket}
                        currentUser={currentUser}
                        setCurrentUser={setCurrentUser}
                        onBack={closeProfileWindow}
                    />
                </div>
            )}

            {isAddGroupDisplayed && (
                <div className="displayed-user-profile">
                    <AddGroup
                        socket={socket}
                        currentUser={currentUser}
                        setCurrentUser={setCurrentUser}
                        onBack={closeAddGroupWindow}
                    />
                </div>
            )}

            <div className={`app ${isUserProfileDisplayed ? "blurred" : ""}`}>
                <div className={`chats-bar ${selectedChat ? "chat-is-selected" : ""}`}>
                    <div className="pinned-user-bar">
                        <div className="current-user-block">
                            {currentUser &&
                                <CurrentUser
                                    socket={socket}
                                    displayUserProfile={setIsUserProfileDisplayed}
                                    user={currentUser}
                                />
                            }
                        </div>
                        <div className="search-users message-input">
                            <div className="message-input-block">
                                <div className="found-users-input-block">
                                    <input
                                        type="text"
                                        value={foundUsersInput}
                                        onChange={searchUsers}
                                        placeholder={`🔍 ${translations.search[language]}...`}
                                    />
                                    {foundUsersInput ? (
                                        <div className="clear-input-btn">
                                            <button className="clear-btn" onClick={clearFoundUsersInput}>×</button>
                                        </div>
                                    ) : (
                                        <div className="clear-input-btn">
                                            <button onClick={displayAddGroupWindow}>
                                                {translations.newGroup[language]}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {foundUsersInput && (
                                    <div className="found-users scrollable">
                                        {foundUsers.length === 0 && (
                                            <div className="no-users-found">
                                                <p>{translations.noUsersFound[language]}</p>
                                            </div>
                                        )}

                                        {foundUsers.length > 0 && foundUsers.map((user) => (
                                            <FoundUserItem
                                                key={`found_user_${user.id}`}
                                                user={user}
                                                onClick={() => { startNewChat(user) }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="user-items-container">
                        {currentUser && (
                            <div
                                className={
                                    `scrollable 
                                    ${currentUser.chats.length > 0 ? "" : "display-search-users-message"}`
                                }
                            >
                                {currentUser.chats.length > 0 ? currentUser.chats.map((chat) => (
                                    <ChatItem
                                        socket={socket}
                                        key={`chat_item_${chat.id}`}
                                        chat={chat}
                                        displayedChats={displayedChats}
                                        currentUser={currentUser}
                                        selectedChat={selectedChat}
                                        onClick={() => selectChat(chat.id)}
                                    />
                                )) : translations.findUsersOrCreateGroup[language]}
                            </div>
                        )}
                    </div>

                </div>
                {selectedChat ? (
                    <div className="chat-area">
                        <ChatArea
                            socket={socket}
                            chat={selectedChat}
                            offset={offset}
                            loadChatHistory={loadChatHistory}
                            displayedChats={displayedChats}
                            moveChatToTop={moveChatToTop}
                            currentUser={currentUser}
                            setLoadChatHistory={setLoadChatHistory}
                            loadedHistoryItemsCount={loadedHistoryItemsCount}
                            currentChatHistory={currentChatHistory}
                            setCurrentChatHistory={setCurrentChatHistory}
                            onBack={closeChatArea}
                        />
                    </div>
                ) : (
                    <div className="no-chat-selected">
                        <p>{translations.selectChatToStartMessaging[language]}</p>
                    </div>
                )}
            </div>
        </div>
    );
}


export default Chats;
