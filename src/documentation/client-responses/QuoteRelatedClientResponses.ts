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
    static QUOTED_MESSAGE (message: Message): Promise<MessageEmbed> {
        return message.guild.member(message.author).fetch().then((member) => {
            const msg = BasicEmbed.get()
                .setAuthor(member.displayName, message.author.avatarURL(), message.url)
                .setDescription(message.content)
                .setTimestamp(message.createdAt)
                .setFooter("A quote from the past...")
                .setColor(member.displayHexColor);

            // Set the image if there is one.
            const attachments = message.attachments;
            if (attachments != null && attachments.size > 0) {
                msg.setImage(attachments.first().url);
            }

            return msg;
        });
    }
}