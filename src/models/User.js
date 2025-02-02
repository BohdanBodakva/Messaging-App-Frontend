import getDefaultProfilePhotoLink from "../constants/defaultPhotoLinks";
import {Chat} from "./Chat";
import {Message} from "./Message";

export class User {
    constructor({
                    id,
                    name,
                    surname = "",
                    username,
                    profilePhotoLink = null,
                    lastSeen = null,
                    chats = [],
                    unreadMessages = []
                }) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.username = username;
        this._profilePhotoLink = profilePhotoLink ? profilePhotoLink : getDefaultProfilePhotoLink(name);
        this.lastSeen = lastSeen ? lastSeen : null;
        this.chats = chats;
        this.unreadMessages = unreadMessages;
    }

    get profilePhotoLink() {
        return this._profilePhotoLink;
    }

    set profilePhotoLink(profilePhotoLink) {
        if (profilePhotoLink) {
            this._profilePhotoLink = profilePhotoLink;
        } else {
            this._profilePhotoLink = getDefaultProfilePhotoLink(this.name);
        }
    }

    static fromJson(json) {
        let chats = json.chats ? json.chats.map(c => {
            return Chat.fromJson(c);
        }) : [];

        let unreadMessages = json.unread_messages ? json.unread_messages.map(c => {
            return Message.fromJson(c);
        }) : [];

        return new User({
            id: json.id,
            name: json.name,
            surname: json.surname,
            username: json.username,
            password: json.password,
            profilePhotoLink: json.profile_photo_link,
            lastSeen: json.last_seen,
            chats: chats,
            unreadMessages: unreadMessages,
        })
    }

    static toJson(user: User) {
        return {
            "id": user.id,
            "name": user.name,
            "surname": user.surname,
            "username": user.username,
            "password": user.password,
            "profile_photo_link": user.profilePhotoLink,
            "last_seen": user.lastSeen,
            "chats": user.chats,
            "unread_messages": user.unreadMessages,
        }
    }
}