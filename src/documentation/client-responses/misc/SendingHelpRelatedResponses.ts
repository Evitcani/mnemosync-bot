import {MessageEmbed} from "discord.js";
import {BasicEmbed} from "../../BasicEmbed";
import {Bot} from "../../../bot";
import {Subcommands} from "../../commands/Subcommands";

/**
 * Helps the sending command if something went wrong.
 */
export class SendingHelpRelatedResponses {
    /**
     * Message to show if the sending has no date.
     *
     * @param messageContents Original contents of the message.
     */
    static MESSAGE_HAS_NO_DATE(messageContents: string): MessageEmbed {
        return BasicEmbed.get()
            .setTitle(`Message has no date!`)
            .setDescription(`Message has no date. Add message (in-game) date with ` +
                `\`${Bot.PREFIX_SUBCOMMAND}${Subcommands.DATE} [day]/[month]/[year]\`.\n\n` +
                `Here is your original message with the added date parameter:\n` +
                `\`\`\`${messageContents} ${Bot.PREFIX_SUBCOMMAND}${Subcommands.DATE} [day]/[month]/[year]\`\`\``)
    }
}