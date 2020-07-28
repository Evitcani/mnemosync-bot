"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpDocumentation = void 0;
const BaseCommandDocumentation_1 = require("./BaseCommandDocumentation");
const Subcommands_1 = require("../Subcommands");
const Commands_1 = require("../Commands");
const BasicEmbed_1 = require("../../BasicEmbed");
const bot_1 = require("../../../bot");
class HelpDocumentation {
    static find(command) {
        if (this.cmdMap == null) {
            this.createMap();
        }
        let cmd = this.cmdMap.get(command);
        if (cmd == null) {
            return this.get();
        }
        return cmd.getFullDescription();
    }
    static createMap() {
        this.cmdMap = new Map();
        this.cmdMap.set(this.BANK.getCommand(), this.BANK);
    }
    static get() {
        let str = "";
        str += this.BANK.formatCommand() + "\n\n";
        return BasicEmbed_1.BasicEmbed.get()
            .setTitle(`Commands`)
            .setDescription(`Below is a basic overview of all commands. For a more detailed description of a command ` +
            `type, \`${bot_1.Bot.PREFIX}${Commands_1.Commands.HELP} [command name]\`.\n\n` +
            str);
    }
}
exports.HelpDocumentation = HelpDocumentation;
HelpDocumentation.cmdMap = null;
HelpDocumentation.BANK = new class extends BaseCommandDocumentation_1.BaseCommandDocumentation {
    getBasicDescription() {
        return `Used to access the funds in the bank for the party.`;
    }
    getCommand() {
        return Commands_1.Commands.BANK;
    }
    getFullDescription() {
        return BasicEmbed_1.BasicEmbed.get()
            .setTitle(`Bank Command`)
            .setDescription(`${this.getBasicDescription()} You must have a character in a party to be able to ` +
            `use this command. If given no arguments, it will print the current amount in the bank.\n\n` +
            `**Adding Money**\n` +
            `If given arguments, it will add or subtract that amount from the current amount. To add more ` +
            `money, type out the amount you wish to add like the following:` +
            `\`\`\`${bot_1.Bot.PREFIX}${this.getCommand()} 1g 2 silver 3 cp\`\`\`` +
            `This will add \`1 gold, 2 silver and 3 copper\` to the current bank fund.\n\n` +
            `**Removing Money**\n` +
            `If given arguments, it will add or subtract that amount from the current amount. You must add a ` +
            `\`-\` sign to any of the numbers to indicate a removal. To remove money, type out the amount ` +
            `you wish to remove like the following:` +
            `\`\`\`${bot_1.Bot.PREFIX}${this.getCommand()} 1g -2 silver 3 cp\`\`\`` +
            `This will remove \`1 gold, 2 silver and 3 copper\` from the current bank fund.\n\n` +
            `**Subcommands**\n` +
            `${this.formatSubcommands()}`);
    }
    getSubcommands() {
        let map = new Map();
        map.set(Subcommands_1.Subcommands.CREATE, `Creates a new bank fund for the party. Requires no arguments.`);
        return undefined;
    }
};
//# sourceMappingURL=HelpDocumentation.js.map