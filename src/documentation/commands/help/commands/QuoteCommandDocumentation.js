"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteCommandDocumentation = void 0;
const BaseCommandDocumentation_1 = require("./BaseCommandDocumentation");
const Commands_1 = require("../../Commands");
const BasicEmbed_1 = require("../../../BasicEmbed");
const bot_1 = require("../../../../bot");
class QuoteCommandDocumentation extends BaseCommandDocumentation_1.BaseCommandDocumentation {
    getBasicDescription() {
        return `Used to get a random quote from a quote channel.`;
    }
    getCommand() {
        return Commands_1.Commands.QUOTE;
    }
    getFullDescription() {
        return BasicEmbed_1.BasicEmbed.get()
            .setTitle(`Quote Command`)
            .setDescription(`${this.getBasicDescription()} To get a random quote after setting up quotes channel, ` +
            `type, \`${bot_1.Bot.PREFIX}${this.getCommand()}\`, which will retrieve a quote.\n\n` +
            `**Setting Up a Quote Channel**\n` +
            `To set up a quote channel, go into the channel you want to quote and type:` +
            `\`\`\`${bot_1.Bot.PREFIX}${this.getCommand()} here\`\`\`` +
            `The quotes will not populate from this channel. You can delete the command and bot responses from ` +
            `the channel.`);
    }
    getSubcommands() {
        return null;
    }
}
exports.QuoteCommandDocumentation = QuoteCommandDocumentation;
//# sourceMappingURL=QuoteCommandDocumentation.js.map