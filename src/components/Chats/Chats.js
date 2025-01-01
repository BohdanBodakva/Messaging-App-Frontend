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
import {Chat} from "../../models/Chat";
import {Message} from "../../models/Message";

function Chats ({ currentUser = null, setCurrentUser }) {
    const { language } = useLanguage();

    const navigate = useNavigate();

    const[isUserProfileDisplayed, setIsUserProfileDisplayed] = useState(false);
    const[isAddGroupDisplayed, setIsAddGroupDisplayed] = useState(false);

    const [foundUsersInput, setFoundUsersInput] = useState("");
    const [foundUsers, setFoundUsers] = useState([]);

    const [messageList, setMessageList] = useState([]);

    const [loading, setLoading] = useState(false);

    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    async function selectChat(chat_id) {
        setLoading(true);

        const url = `/chats/${chat_id}`;

        try {
            const response = await makeRequest("GET", url);

            setSelectedChat(response.response.data.chat);
            setMessageList(response.response.data.chat.messages);
        } catch (error) {

        }

        setLoading(false);

    }

    useEffect(() => {
        // if (!currentUser){
        //     setLoading(true);
        //
        //     async function loadCurrentUser() {
        //         const url = `/users/current-user`;
        //
        //         const response = await makeRequest("GET", url);
        //
        //         if (response.errorMessage) {
        //             navigate("/login");
        //         } else {
        //             const currentUser = User.fromJson(response.response.data.user)
        //             setCurrentUser(currentUser);
        //         }
        //
        //         setLoading(false);
        //     }
        //     loadCurrentUser();
        //
        // } else {
        //
        // }

        // WEBSOCKET CONNECTION
        setLoading(true);

        socket.connect();

        socket.on("load_user", (data) => {
            console.log(data);

            const user = new User(data.user);
            setCurrentUser(user);

            const chats = currentUser.chats;
            const chatList = [];
            chats.forEach((chat) => {
                const chatObject = new Chat(chat);

                const messages = chatObject.messages;
                const messageList = [];

                messages.forEach((message) => {
                    const messageObject = new Message(message);
                    messageList.push(messageObject);
                })
                chatObject.messages = messageList;

                chatList.push(chatObject);
            })

            setChats(chatList);
        })

        socket.on("load_user_error", (data) => {
            console.log(data);
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
            console.log(data);
            socket.disconnect();
        })

        socket.on("validate_token", (data) => {
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

        socket.on("validate_token_error", (data) => {
            console.log("Token validation failed: ", data);

            if (data.error.includes("Signature has expired")) {
                // refresh access_token
                console.log("let's go and refresh");
                let newAccessToken = null;
                (async function() {
                    newAccessToken = await refreshAccessToken();

                    socket.emit(
                        "validate_refreshed_token",
                        {"access_token": newAccessToken}
                    );
                })();
            } else {
                socket.disconnect();
            }
        })

        socket.emit(
            "validate_token",
            {"access_token": localStorage.getItem("access_token")}
        );

        setLoading(false);

        return () => {
            socket.off("validate_token");
            socket.off("validate_token_error");
            socket.off("validate_refreshed_token");
            socket.off("validate_refreshed_token_error");

            socket.disconnect();
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
        // setIsAddGroupDisplayed(true);



        socket.emit(
            "validate_token",
            {"access_token": localStorage.getItem("access_token")}
        );
    }



    function closeAddGroupWindow () {
        setIsAddGroupDisplayed(false);
    }

    return (
        <div className="main-app-block" style={{position: "relative"}}>
            {isUserProfileDisplayed && (
                <div className="displayed-user-profile">
                    <Profile
                        currentUser={currentUser}
                        setCurrentUser={setCurrentUser}
                        onBack={closeProfileWindow}
                    />
                </div>
            )}

            {isAddGroupDisplayed && (
                <div className="displayed-user-profile">
                    <AddGroup
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
                                                key={user.id}
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
                    <div className="scrollable">
                        {chats.map((chat) => (
                            <ChatItem
                                key={chat.id}
                                chat={chat}
                                currentUser={currentUser}
                                selectedChat={selectedChat}
                                onClick={() => selectChat(chat.id)}
                            />
                        ))}
                    </div>
                </div>
                {selectedChat ? (
                    <div className="chat-area">
                        <ChatArea
                            loading={loading}
                            chat={selectedChat}
                            currentUser={currentUser}
                            messageList={messageList}
                            setMessageList={setMessageList}
                            onBack={() => setSelectedChat(null)}
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
