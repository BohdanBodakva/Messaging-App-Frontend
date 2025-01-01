export class SentFile {
    constructor({
                    id,
                    fileLink,
                    messageId
                }) {
        this.id = id;
        this.fileLink = fileLink;
        this.messageId = messageId;
    }

    static fromJson(json) {
        return new SentFile({
            id: json.id,
            fileLink: json.file_link,
            messageId: json.message_id,
        })
    }

    static toJson(file: SentFile) {
        return {
            "id": file.id,
            "file_link": file.fileLink,
            "message_id": file.messageId,
        }
    }
}