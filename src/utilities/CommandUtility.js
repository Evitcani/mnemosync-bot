"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandUtility = void 0;
const Command_1 = require("../models/generic/Command");
const Subcommand_1 = require("../models/generic/Subcommand");
const bot_1 = require("../bot");
const StringUtility_1 = require("./StringUtility");
const Commands_1 = require("../documentation/commands/Commands");
/**
 * A utility for processing and understanding commands.
 */
class CommandUtility {
    /**
     * Processes the commands into something legible.
     *
     * @param message The message with all the commands.
     */
    static processCommands(message) {
        // Split the args.
        const args = message.substr(bot_1.Bot.PREFIX.length).split(bot_1.Bot.PREFIX_SUBCOMMAND);
        // Get the base command.
        const baseCommand = args.shift();
        const command = this.getCommand(baseCommand);
        // Get the subcommands.
        let subcommands = null, subcommand;
        if (args.length > 0) {
            subcommands = new Map();
            let i;
            for (i = 0; i < args.length; i++) {
                subcommand = this.getSubcommand(args[i], command.isMoneyRelated);
                subcommands.set(subcommand.getName(), subcommand);
            }
        }
        // Return the new command.
        return new Command_1.Command(command.subcommand.getName(), command.subcommand.getInput(), subcommands);
    }
    /**
     * Gets a subcommand from each command.
     * @param arg The simple arg to process.
     * @param isMoneyRelated
     */
    static getSubcommand(arg, isMoneyRelated) {
        // Get the basic args.
        const args = arg.split(" ");
        const cmd = args.shift().toLowerCase();
        // Get the input, if there is one.
        let input = args.length > 0 ? args.join(" ") : null;
        input = StringUtility_1.StringUtility.processUserInput(input);
        // Formats the money.
        if (isMoneyRelated) {
            input = StringUtility_1.StringUtility.formatFundInput(input);
        }
        console.debug(`COMMAND UTILITY ::: New subcommand '${cmd}': ${input}`);
        // Return the subcommand.
        return new Subcommand_1.Subcommand(cmd, input);
    }
    static getCommand(arg) {
        // Get the basic args.
        const args = arg.split(" ");
        const cmd = args.shift().toLowerCase();
        // It's money related!
        if (cmd == Commands_1.Commands.FUND || cmd == Commands_1.Commands.BANK) {
            return { subcommand: this.getSubcommand(arg, true), isMoneyRelated: true };
        }
        // Not money related.
        return { subcommand: this.getSubcommand(arg, false), isMoneyRelated: false };
    }
}
exports.CommandUtility = CommandUtility;
//# sourceMappingURL=CommandUtility.js.map