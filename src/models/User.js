import getDefaultProfilePhotoLink from "../constants/defaultPhotoLinks";

export class User {
    constructor({
                    id,
                    name,
                    surname = "",
                    username,
                    password,
                    profilePhotoLink = null,
                    lastSeen = null,
                    chats = [],
                    unreadMessages = []
                }) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.username = username;
        this._password = password;
        this._profilePhotoLink = profilePhotoLink ? profilePhotoLink : getDefaultProfilePhotoLink(this.name);
        this.lastSeen = lastSeen;
        this.chats = chats;
        this.unreadMessages = unreadMessages;
    }

    get password() {
        return this._password;
    }

    set password(password) {
        this._password = password;
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
        return new User({
            id: json.id,
            name: json.name,
            surname: json.surname,
            username: json.username,
            password: json.password,
            profilePhotoLink: json.profile_photo_link,
            lastSeen: json.last_seen,
            chats: json.chats,
            unreadMessages: json.unread_messages,
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