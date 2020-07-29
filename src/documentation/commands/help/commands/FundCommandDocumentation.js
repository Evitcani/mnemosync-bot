"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundCommandDocumentation = void 0;
const BaseCommandDocumentation_1 = require("./BaseCommandDocumentation");
const Commands_1 = require("../../Commands");
const BasicEmbed_1 = require("../../../BasicEmbed");
const bot_1 = require("../../../../bot");
const Subcommands_1 = require("../../Subcommands");
class FundCommandDocumentation extends BaseCommandDocumentation_1.BaseCommandDocumentation {
    getBasicDescription() {
        return `Used to access the funds for the party.`;
    }
    getCommand() {
        return Commands_1.Commands.FUND;
    }
    getFullDescription() {
        return BasicEmbed_1.BasicEmbed.get()
            .setTitle(`Fund Command`)
            .setDescription(`${this.getBasicDescription()} You must have a character in a party to be able to ` +
            `use this command. If given no arguments, it will print the current amount in the fund.\n\n` +
            `**Adding Money**\n` +
            `If given arguments, it will add or subtract that amount from the current amount. To add more ` +
            `money, type out the amount you wish to add like the following:` +
            `\`\`\`${bot_1.Bot.PREFIX}${this.getCommand()} 1g 2 silver 3 cp\`\`\`` +
            `This will add \`1 gold, 2 silver and 3 copper\` to the current fund.\n\n` +
            `**Removing Money**\n` +
            `If given arguments, it will add or subtract that amount from the current amount. You must add a ` +
            `\`-\` sign to any of the numbers to indicate a removal. To remove money, type out the amount ` +
            `you wish to remove like the following:` +
            `\`\`\`${bot_1.Bot.PREFIX}${this.getCommand()} 1g -2 silver 3 cp\`\`\`` +
            `This will remove \`1 gold, 2 silver and 3 copper\` from the current fund.\n\n` +
            `**Subcommands**\n` +
            `${this.formatSubcommands()}`);
    }
    getSubcommands() {
        let map = new Map();
        map.set(Subcommands_1.Subcommands.CREATE, `Creates a new fund for the party. Requires no arguments.`);
        return map;
    }
}
exports.FundCommandDocumentation = FundCommandDocumentation;
//# sourceMappingURL=FundCommandDocumentation.js.map