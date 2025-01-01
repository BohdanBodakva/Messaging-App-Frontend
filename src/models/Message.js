export class Message {
    constructor({
                    id,
                    text,
                    sentFiles = [],
                    sendAt,
                    usersThatUnread = [],
                    userId,
                    chatId
                }) {
        this.id = id;
        this.text = text;
        this.sentFiles = sentFiles;
        this.sendAt = sendAt;
        this.usersThatUnread = usersThatUnread;
        this.userId = userId;
        this.chatId = chatId;
    }

    static fromJson(json) {
        return new Message({
            id: json.id,
            text: json.text,
            sentFiles: json.sent_files,
            sendAt: json.send_at,
            usersThatUnread: json.users_that_unread,
            userId: json.user_id,
            chatId: json.chat_id,
        })
    }

    static toJson(message: Message) {
        return {
            "id": message.id,
            "text": message.text,
            "sent_files": message.sentFiles,
            "send_at": message.sendAt,
            "users_that_unread": message.usersThatUnread,
            "user_id": message.userId,
            "chat_id": message.chatId,
        }
    }
}