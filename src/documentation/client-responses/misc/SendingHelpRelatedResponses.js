"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendingHelpRelatedResponses = void 0;
const BasicEmbed_1 = require("../../BasicEmbed");
const bot_1 = require("../../../bot");
const Subcommands_1 = require("../../commands/Subcommands");
const SendingController_1 = require("../../../controllers/character/SendingController");
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
    static CHECK_SENDINGS_FOR_WHICH(character, world) {
        return BasicEmbed_1.BasicEmbed.get()
            .setTitle("Choose the which you'd like to see messages for.")
            .setDescription(`Reply with the given number to decide which you'd like to sendings for.\n` +
            `[\`1\`] (\`World    \`) ${world.name}\n` +
            `[\`2\`] (\`Character\`) ${character.name}\n`);
    }
    static NO_DEFAULT_WORLD_OR_CHARACTER() {
        return BasicEmbed_1.BasicEmbed.get()
            .setTitle("You have no default world or character.")
            .setDescription("Can't fetch messages for no one or nothing!");
    }
    static PRINT_MESSAGES_FROM_WORLD(messages, world, page) {
        let messageStr = this.processMessages(messages, page, true, true);
        return BasicEmbed_1.BasicEmbed.get()
            .setTitle(`Unreplied Messages Sent to NPCs in ${world.name}`)
            .setDescription(`Here are the messages sent to NPCs in this world:\n\n${messageStr}`);
    }
    static PRINT_MESSAGES_TO_CHARACTER(messages, character, page) {
        let messageStr = this.processMessages(messages, page, false, true);
        return BasicEmbed_1.BasicEmbed.get()
            .setTitle(`Unreplied Messages Sent to ${character.name}`)
            .setDescription(`Here are the messages sent to you:\n\n${messageStr}`);
    }
    static processMessages(messages, page, includeTo, includeFrom) {
        let additional = page * SendingController_1.SendingController.SENDING_LIMIT;
        let str = "";
        let i, message;
        for (i = 0; i < messages.length; i++) {
            message = messages[i];
            str += `[\`${additional + i}\`] **GAME DATE:** ${message.inGameDate.day}/${message.inGameDate.month}/${message.inGameDate.year}\n`;
            if (includeFrom) {
                str += `\`FROM:\` ${message.fromPlayer != null ? message.fromPlayer.name : message.fromNpc.name}\n`;
            }
            if (includeTo) {
                str += `\`TO  :\` ${message.toPlayer != null ? message.toPlayer.name : message.toNpc.name}\n`;
            }
            str += `"${message.content}"\n\n`;
        }
        return str;
    }
}
exports.SendingHelpRelatedResponses = SendingHelpRelatedResponses;
//# sourceMappingURL=SendingHelpRelatedResponses.js.map