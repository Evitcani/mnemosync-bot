import {Message, MessageEmbed} from "discord.js";
import {BasicEmbed} from "../BasicEmbed";

/**
 * The responses related to the quotes command.
 */
export class QuoteRelatedClientResponses {
    /**
     * Constructs a quoted message reply.
     * @param message
     * @constructor
     */
    static QUOTED_MESSAGE (message: Message): MessageEmbed {
        const presence = message.author.presence.member;

        const msg = BasicEmbed.get()
            .setAuthor(presence.displayName, message.author.avatarURL(), message.url)
            .setDescription(message.content)
            .setTimestamp(message.createdAt)
            .setFooter("A quote from the past...")
            .setColor(presence.displayHexColor);

        // Set the image if there is one.
        const attachments = message.attachments;
        if (attachments != null && attachments.size > 0) {
            msg.setImage(attachments.first().url);
        }

        return msg;
    }
}