import React, {useEffect, useState} from "react";
import "./AddGroup.css";
import {useLanguage} from "../../providers/translations/LanguageProvider";
import {translations} from "../../providers/translations/translations";
import back_button_svg from "../../images/back_button.svg";
import FoundUserItem from "../Chats/FoundUserItem";
import makeRequest from "../../logic/HttpRequests";
import LoadingSpinner from "../Spinner/LoadingSpinner";
import UserCard from "../UserCard/UserCard";
import group_svg from "../../images/group.svg";

function AddGroup({ currentUser, setCurrentUser, onBack }) {
    const { language } = useLanguage();

    const[loading, setLoading] = useState(true);

    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const [foundUsersInput, setFoundUsersInput] = useState("");
    const [foundUsers, setFoundUsers] = useState([]);
    const [groupUsers, setGroupUsers] = useState([]);

    async function searchUsers(event) {
        const text = event.target.value

        setLoading(true);

        setFoundUsersInput(text)

        if (text !== "") {
            const url = `/users/username/contains/${text}`;
            const response = await makeRequest("GET", url);

            setFoundUsers(response.data.users)
        } else {
            setFoundUsers([])
        }

        setLoading(false);
    }

    useEffect(() => {
        setLoading(false);
    }, [])

    function clearFoundUsersInput() {
        setFoundUsersInput("")
        setFoundUsers([])
    }

    function addUserToGroup(user) {
        if (user && !groupUsers.includes(user)) {
            setGroupUsers((arr) => [...arr, user]);
        }
    }

    function removeUserFromGroup(user) {
        setGroupUsers((arr) => arr.filter((u) => u.id !== user.id));
    }

    return (
        <div className="central-block">'
            {loading && (
                <LoadingSpinner />
            )}
            {currentUser && (
                <div className="inner-block">
                    <div className="user-settings" >
                        <div className="inner-user-settings">
                            <div className="profile-section">
                                <div className="profile-header">
                                    <div className="go-back">
                                        <button className="back-button" onClick={onBack}>
                                            <img src={back_button_svg} alt={currentUser.username}
                                                 className="back-button-image"/>
                                        </button>
                                    </div>
                                    <h2>{translations.newGroup[language]}</h2>
                                    <div className="go-back">
                                        <div className="right-empty-block"></div>
                                    </div>
                                </div>
                                <div
                                    className={`group-photo ${currentUser.profile_photo_link ? "black-border" : ""}`}
                                >
                                    <div className={
                                        `group-photo-image 
                                        ${!selectedPhoto ? "black-border" : ""}`
                                    }>
                                        <img
                                            src={selectedPhoto ? selectedPhoto : group_svg}
                                            alt="User"
                                        />
                                    </div>
                                    <div className="choose-photo">
                                        <input type="file" id="file" className="file-input"/>
                                        <label htmlFor="file" className="file-label">
                                            <span className="file-icon">
                                                {translations.changeProfilePhoto[language]}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="user-fields">
                                    <label>
                                        <input
                                            type="text"
                                            placeholder={`${translations.newGroupName[language]}...`}
                                        />
                                    </label>
                                </div>
                                <div className="search-users message-input message-input-add-group">
                                    <div className="message-input-group-block increased-height">
                                        <div className="centered">
                                            <div className="found-users-input-group-block">
                                                <div className="users-input">
                                                    <input
                                                        type="text"
                                                        value={foundUsersInput}
                                                        onChange={searchUsers}
                                                        placeholder={`🔍 ${translations.addUsers[language]}...`}
                                                    />
                                                    {foundUsersInput && (
                                                        <div className="clear-input-btn">
                                                            <button className="clear-btn"
                                                                    onClick={clearFoundUsersInput}>×
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div
                                                className={
                                                    `found-group-users scrollable 
                                                    ${foundUsersInput ? "found-users-border" : "hide-search"}`
                                                }
                                            >
                                                {foundUsersInput && (
                                                    <div className="centr">
                                                        {foundUsers.length === 0 && (
                                                            <div className="no-users-found">
                                                                <p>{translations.noUsersFound[language]}</p>
                                                            </div>
                                                        )
                                                        }

                                                        {foundUsers.length > 0 && foundUsers.map((user) => (
                                                            <FoundUserItem
                                                                key={user.id}
                                                                user={user}
                                                                onClick={() => {
                                                                }}
                                                                onAddUser={addUserToGroup}
                                                            />
                                                        ))
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <p className="added-users-text">
                                            {translations.addedUsers[language]} ({groupUsers.length}):
                                        </p>
                                        <div className="added-found-group-users scrollable">
                                            {groupUsers.length > 0 && groupUsers.map((user) => (
                                                <UserCard
                                                    key={user.id}
                                                    user={user}
                                                    onRemove={removeUserFromGroup}
                                                />
                                            ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="save-btn-container">
                                <button className="save-button save">
                                    {translations.createGroup[language]}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}

export default AddGroup;
