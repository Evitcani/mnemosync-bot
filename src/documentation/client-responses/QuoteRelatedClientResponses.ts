import {Message, MessageEmbed} from "discord.js";
import {BasicEmbed} from "../BasicEmbed";
import {StringUtility} from "../../utilities/StringUtility";
import {Bot} from "../../bot";
import {Commands} from "../commands/Commands";

/**
 * The responses related to the quotes command.
 */
export class QuoteRelatedClientResponses {
    /**
     * Constructs a quoted message reply.
     *
     * @param message The message to quote.
     * @param numberOfQuotes
     */
    static QUOTED_MESSAGE (message: Message, numberOfQuotes: number): Promise<MessageEmbed> {
        return message.guild.member(message.author).fetch().then((member) => {
            const msg = BasicEmbed.get();

            if (member == null) {
                msg
                    .setAuthor(message.author.username, message.author.avatarURL(), message.url);
            } else {
                msg
                    .setAuthor(member.displayName, message.author.avatarURL(), message.url)
                    .setColor(member.displayHexColor);
            }

            msg
                .setDescription(message.content)
                .setTimestamp(message.createdAt)
                .setFooter(`1 of ${StringUtility.numberWithCommas(Math.abs(numberOfQuotes))} quotes. Type ` +
                    `\`${Bot.PREFIX}${Commands.QUOTE}\` to get one yourself!`);


            // Set the image if there is one.
            const attachments = message.attachments;
            if (attachments != null && attachments.size > 0) {
                msg.setImage(attachments.first().url);
            }

            return msg;
        });
    }
}