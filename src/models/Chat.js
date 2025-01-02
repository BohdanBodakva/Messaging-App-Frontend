import group_svg from "../images/group.svg";
import getDefaultProfilePhotoLink from "../constants/defaultPhotoLinks";
import {User} from "./User";
import {Message} from "./Message";

export class Chat {
    constructor({
                    id,
                    name = null,
                    createdAt,
                    adminId = null,
                    users = [],
                    chatPhotoLink = null,
                    isGroup = false,
                    messages = []
                }) {
        let photo;
        if (isGroup) {
            photo = chatPhotoLink ? chatPhotoLink : group_svg;
        } else {
            const otherUser = users.filter(u => u.id !== id)[0];
            if (otherUser) {
                photo = otherUser.profilePhotoLink ?
                    otherUser.profilePhotoLink : getDefaultProfilePhotoLink(otherUser.name);
            } else {
                photo = getDefaultProfilePhotoLink("u");
            }
        }

        this.id = id;
        this.name = name ? name : "New Group";
        this.createdAt = createdAt;
        this.adminId = adminId;
        this.users = users;
        this._chatPhotoLink = photo;
        this.isGroup = isGroup;
        this.messages = messages;
    }

    get chatPhotoLink() {
        return this._chatPhotoLink;
    }

    set chatPhotoLink(chatPhotoLink) {
        if (chatPhotoLink) {
            this._chatPhotoLink = chatPhotoLink;
        } else {
            this._chatPhotoLink = group_svg;
        }
    }

    static fromJson(json) {
        let users = json.users ? json.users.map(c => {
            return User.fromJson(c);
        }) : [];

        let messages = json.messages ? json.messages.map(c => {
            return Message.fromJson(c);
        }) : [];

        return new Chat({
            id: json.id,
            name: json.name,
            createdAt: json.created_at,
            adminId: json.admin_id,
            users: users,
            chatPhotoLink: json.chat_photo_link,
            isGroup: json.is_group,
            messages: messages,
        })
    }

    static toJson(chat: Chat) {
        return {
            "id": chat.id,
            "name": chat.name,
            "created_at": chat.createdAt,
            "admin_id": chat.adminId,
            "users": chat.users,
            "chat_photo_link": chat.chatPhotoLink,
            "is_group": chat.isGroup,
            "messages": chat.messages,
        }
    }
}