import group_svg from "../images/group.svg";

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
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.adminId = adminId;
        this.users = users;
        this._chatPhotoLink = chatPhotoLink ? chatPhotoLink : group_svg;
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
        return new Chat({
            id: json.id,
            name: json.name,
            createdAt: json.created_at,
            adminId: json.admin_id,
            users: json.users,
            chatPhotoLink: json.chat_photo_link,
            isGroup: json.is_group,
            messages: json.messages,
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