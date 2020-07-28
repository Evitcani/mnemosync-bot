"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCommandDocumentation = void 0;
const bot_1 = require("../../../bot");
class BaseCommandDocumentation {
    formatCommand() {
        return `\`${bot_1.Bot.PREFIX}${this.getCommand()}\` - ${this.getBasicDescription()}`;
    }
    /**
     * Formats the subcommands for this command into a pretty string for printing.
     */
    formatSubcommands() {
        let str = "";
        let subcommands = this.getSubcommands();
        if (!subcommands) {
            return "";
        }
        subcommands.forEach((value, key) => {
            // Add spacing.
            str += `\n\n`;
            // Add the name of the prefix.
            str += `\`${bot_1.Bot.PREFIX_SUBCOMMAND}${key.name}\``;
            if (key.shortenedName != null) {
                str += ` | \`${bot_1.Bot.PREFIX_SUBCOMMAND}${key.shortenedName}\``;
            }
            str += ` - ${value}`;
        });
        return str;
    }
}
exports.BaseCommandDocumentation = BaseCommandDocumentation;
//# sourceMappingURL=BaseCommandDocumentation.js.map