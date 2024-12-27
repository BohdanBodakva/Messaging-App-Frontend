import React, {useEffect, useState} from "react";
import './Chats.css';
import ChatItem from "./ChatItem";
import ChatArea from "./ChatArea";
import CurrentUser from "./CurrentUser";
import {useNavigate} from "react-router-dom";
import makeRequest from "../../logic/HttpRequests";
import LoadingSpinner from "../Spinner/LoadingSpinner";

function Chats ({ currentUser = null, setCurrentUser }) {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    async function selectChat(chat_id) {
        setLoading(true);

        const url = `/chats/${chat_id}`;

        try {
            const response = await makeRequest("GET", url);

            setSelectedChat(response.data.chat);
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

    return (
        <div style={{position: 'relative'}}>
            {loading && <LoadingSpinner/>}
            <div className={`app ${selectedChat ? "" : "app-centered"}`}>
                <div className={`chats-bar ${selectedChat ? "" : "centered"}`}>
                    <div className="current-user-block">
                        {currentUser && <CurrentUser user={currentUser} />}
                    </div>
                    {chats.map((chat) => (
                        <ChatItem
                            key={chat.id}
                            chat={chat}
                            isSelected={selectedChat === chat.id}
                            onClick={() => selectChat(chat.id)}
                        />
                    ))}
                </div>
                {selectedChat && (
                    <div className="chat-area">
                        <ChatArea
                            chat={selectedChat}
                            currentUser={currentUser}
                            onBack={() => setSelectedChat(null)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}


export default Chats;
