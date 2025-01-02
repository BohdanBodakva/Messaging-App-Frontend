import {SentFile} from "./SentFIle";
import {User} from "./User";

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
        let sentFiles = json.sent_files ? json.sent_files.map(c => {
            return SentFile.fromJson(c);
        }) : [];

        let usersThatUnread = json.users_that_unread ? json.users_that_unread.map(c => {
            return c.id;
        }) : [];

        return new Message({
            id: json.id,
            text: json.text,
            sentFiles: sentFiles,
            sendAt: json.send_at,
            usersThatUnread: usersThatUnread,
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