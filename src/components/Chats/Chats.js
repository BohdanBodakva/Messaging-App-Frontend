import React, {useEffect, useState} from "react";
import './Chats.css';
import ChatItem from "./ChatItem";
import ChatArea from "./ChatArea";
import CurrentUser from "./CurrentUser";
import {useNavigate} from "react-router-dom";
import makeRequest from "../../logic/HttpRequests";
import LoadingSpinner from "../Spinner/LoadingSpinner";
import FoundUserItem from "./FoundUserItem";

function Chats ({ currentUser = null, setCurrentUser }) {
    const navigate = useNavigate();

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

            setSelectedChat(response.data.chat);
            setMessageList(response.data.chat.messages);
        } catch (error) {

        }

        setLoading(false);

    }

    useEffect(() => {
        if (!currentUser){
            setLoading(true);

            const currentUserId = localStorage.getItem("current_user_id");

            if (currentUserId) {
                async function loadCurrentUser() {
                    const url = `/users/${currentUserId}`;

                    let response;
                    try {
                        response = await makeRequest("GET", url);
                        console.log(response);
                        setChats(response.data.user.chats);
                    } catch (error) {
                        navigate("/login");
                    }
                    setLoading(false);
                    setCurrentUser(response.data.user);
                }
                loadCurrentUser();
            } else {
                setLoading(false);
                navigate("/login");
            }
        } else {
            setChats(currentUser.chats);
        }

        // WEBSOCKET CONNECTION





    }, []);

    async function searchUsers(event) {
        const text = event.target.value

        setFoundUsersInput(text)

        if (text !== "") {
            const url = `/users/username/contains/${text}`;
            const response = await makeRequest("GET", url);

            setFoundUsers(response.data.users)
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

    return (
        <div className="app">
            <div className="chats-bar">
                <div className="pinned-user-bar">
                    <div className="current-user-block">
                        {currentUser && <CurrentUser user={currentUser}/>}
                    </div>
                    <div className="search-users message-input">
                        <div className="message-input-block">
                            <div className="found-users-input-block">
                                <input
                                    type="text"
                                    value={foundUsersInput}
                                    onChange={searchUsers}
                                    placeholder="🔍 Search..."
                                />
                                {foundUsersInput ? (
                                    <div className="clear-input-btn">
                                        <button onClick={clearFoundUsersInput}>❌</button>
                                    </div>
                                ) : (
                                    <div className="clear-input-btn">
                                        <button onClick={createGroup}>Create group</button>
                                    </div>
                                )}
                            </div>
                            {foundUsers.length > 0 && (
                                <div className="found-users scrollable">
                                {foundUsersInput && foundUsers.length === 0 && (
                                        <div className="no-users-found">
                                            <p>No users found</p>
                                        </div>
                                    )}

                                    {foundUsers.map((user) => (
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
                    <p>Select a chat to start messaging</p>
                </div>
            )}
        </div>
    );
}


export default Chats;
