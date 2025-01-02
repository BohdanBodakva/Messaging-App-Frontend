import React, {useEffect, useState} from "react";
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

const loadedHistoryItemsCount = 6;

function Chats ({ currentUser, setCurrentUser }) {
    const { language } = useLanguage();

    const navigate = useNavigate();

    const[isUserProfileDisplayed, setIsUserProfileDisplayed] = useState(false);
    const[isAddGroupDisplayed, setIsAddGroupDisplayed] = useState(false);

    const [foundUsersInput, setFoundUsersInput] = useState("");
    const [foundUsers, setFoundUsers] = useState([]);

    const [currentChatHistory, setCurrentChatHistory] = useState([]);

    const [loading, setLoading] = useState(false);

    const [selectedChat, setSelectedChat] = useState(null);

    function selectChat(chat_id) {
        setCurrentChatHistory([]);

        const chat = currentUser.chats.filter((c) => c.id === chat_id)[0];

        if (chat && (selectedChat ? selectedChat.id !== chat.id : true)) {
            setSelectedChat(chat);

            console.log("selected chat___: ", selectedChat);

            socket.emit(
                "load_chat_history",
                {
                    "chat_id": chat_id,
                    "items_count": loadedHistoryItemsCount,
                    "offset": 0
                }
            )
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

        // WEBSOCKET CONNECTION
        // const socket = io(webSocketBackendUrl, {
        //     transports: ['websocket'],
        // });
        //
        // setSocketConnection(socket);



        // =============================================================================



        socket.on("join_room", (data) => {
            const room = data.room;
        })

        socket.on("load_user", (data) => {
            const userJson = data.user;
            const user = User.fromJson(userJson);

            setCurrentUser(user);

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
            const messages = data.chat_history ?
                data.chat_history.map(m => Message.fromJson(m)) : [];

            // console.log("GGGGGGG: ", chatId, currentChatHistory[0].chatId)

            // if (currentChatHistory.length !== 0 && chatId === currentChatHistory[0].chatId) {
            //     setCurrentChatHistory(prevState => [...prevState, ...messages]);
            // } else {
            setCurrentChatHistory(prevState => [...messages, ...prevState]);
            // }

        })

        socket.on("validate_refreshed_token", (data) => {
            console.log(data);

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
            console.log("Token validation failed: ", data);

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

    }

    function createGroup(user) {

    }

    function closeProfileWindow () {
        setIsUserProfileDisplayed(false);
    }

    function displayAddGroupWindow () {
        setIsAddGroupDisplayed(true);



        // socket.emit(
        //     "validate_token",
        //     {"access_token": localStorage.getItem("access_token")}
        // );
    }

    function closeChatArea() {
        setSelectedChat(null);
        setCurrentChatHistory([]);
    }

    function closeAddGroupWindow () {
        setIsAddGroupDisplayed(false);
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
                                                onClick={() => {
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {currentUser && (
                        <div className="scrollable">
                            {currentUser.chats && currentUser.chats.map((chat) => (
                                <ChatItem
                                    socket={socket}
                                    key={`chat_item_${chat.id}`}
                                    chat={chat}
                                    currentUser={currentUser}
                                    selectedChat={selectedChat}
                                    onClick={() => selectChat(chat.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
                {selectedChat ? (
                    <div className="chat-area">
                        <ChatArea
                            socket={socket}
                            chat={selectedChat}
                            currentUser={currentUser}
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
