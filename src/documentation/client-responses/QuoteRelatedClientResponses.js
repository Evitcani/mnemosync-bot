"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteRelatedClientResponses = void 0;
const BasicEmbed_1 = require("../BasicEmbed");
/**
 * The responses related to the quotes command.
 */
class QuoteRelatedClientResponses {
    static QUOTED_MESSAGE(message) {
        const msg = BasicEmbed_1.BasicEmbed.get()
            .setAuthor(message.author.username, message.author.avatarURL(), message.url)
            .setTitle("A quote from the past...")
            .setDescription(message.content)
            .setTimestamp(message.createdAt);
        const attachments = message.attachments;
        if (attachments != null && attachments.size > 0) {
            attachments.forEach((attachment) => {
                // @ts-ignore TS isn't picking up the type correctly.
                msg.attachFiles(attachment);
            });
        }
        return msg;
    }
}
exports.QuoteRelatedClientResponses = QuoteRelatedClientResponses;
//# sourceMappingURL=QuoteRelatedClientResponses.js.map