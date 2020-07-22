"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendingHelpRelatedResponses = void 0;
const BasicEmbed_1 = require("../../BasicEmbed");
const bot_1 = require("../../../bot");
const Subcommands_1 = require("../../commands/Subcommands");
/**
 * Helps the sending command if something went wrong.
 */
class SendingHelpRelatedResponses {
    /**
     * Message to show if the sending has no date.
     *
     * @param messageContents Original contents of the message.
     */
    static MESSAGE_HAS_NO_DATE(messageContents) {
        return BasicEmbed_1.BasicEmbed.get()
            .setTitle(`Message has no date!`)
            .setDescription(`Message has no date. Add message (in-game) date with ` +
            `\`${bot_1.Bot.PREFIX_SUBCOMMAND}${Subcommands_1.Subcommands.DATE} [day]/[month]/[year]\`.\n\n` +
            `Here is your original message with the added date parameter:\n` +
            `\`\`\`${messageContents} ${bot_1.Bot.PREFIX_SUBCOMMAND}${Subcommands_1.Subcommands.DATE} [day]/[month]/[year]\`\`\``);
    }
}
exports.SendingHelpRelatedResponses = SendingHelpRelatedResponses;
//# sourceMappingURL=SendingHelpRelatedResponses.js.map