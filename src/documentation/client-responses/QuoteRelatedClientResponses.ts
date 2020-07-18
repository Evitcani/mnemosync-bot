import {Message, MessageEmbed} from "discord.js";
import {BasicEmbed} from "../BasicEmbed";

/**
 * The responses related to the quotes command.
 */
export class QuoteRelatedClientResponses {
    static QUOTED_MESSAGE (message: Message): MessageEmbed {
        const msg = BasicEmbed.get()
            .setAuthor(message.author.username, message.author.avatarURL(), message.url)
            .setTitle("A quote from the past...")
            .setDescription(message.content)
            .setTimestamp(message.createdAt);
        const attachments = message.attachments;
        if (attachments != null && attachments.size > 0) {
            attachments.forEach((attachment) => {
                // @ts-ignore TS isn't picking up the type correctly.
                msg.attachFiles(attachment);
            })
        }

        return msg;
    }
}