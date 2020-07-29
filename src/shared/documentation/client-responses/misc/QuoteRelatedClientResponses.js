"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteRelatedClientResponses = void 0;
const BasicEmbed_1 = require("../../BasicEmbed");
const StringUtility_1 = require("../../../../backend/utilities/StringUtility");
const bot_1 = require("../../../../bot/bot");
const Commands_1 = require("../../commands/Commands");
/**
 * The responses related to the quotes command.
 */
class QuoteRelatedClientResponses {
    /**
     * Constructs a quoted message reply.
     *
     * @param message The message to quote.
     * @param numberOfQuotes
     */
    static QUOTED_MESSAGE(message, numberOfQuotes) {
        return message.guild.member(message.author).fetch().then((member) => {
            const msg = BasicEmbed_1.BasicEmbed.get();
            if (member == null) {
                msg
                    .setAuthor(message.author.username, message.author.avatarURL(), message.url);
            }
            else {
                msg
                    .setAuthor(member.displayName, message.author.avatarURL(), message.url)
                    .setColor(member.displayHexColor);
            }
            msg
                .setDescription(message.content)
                .setTimestamp(message.createdAt)
                .setFooter(`1 of ${StringUtility_1.StringUtility.numberWithCommas(Math.abs(numberOfQuotes))} quotes. Type ` +
                `\`${bot_1.Bot.PREFIX}${Commands_1.Commands.QUOTE}\` to get one yourself!`);
            // Set the image if there is one.
            const attachments = message.attachments;
            if (attachments != null && attachments.size > 0) {
                msg.setImage(attachments.first().url);
            }
            return msg;
        });
    }
}
exports.QuoteRelatedClientResponses = QuoteRelatedClientResponses;
//# sourceMappingURL=QuoteRelatedClientResponses.js.map