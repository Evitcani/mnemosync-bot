"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandUtility = void 0;
const Command_1 = require("../models/generic/Command");
const Subcommand_1 = require("../models/generic/Subcommand");
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
        const args = message.substr(1).split("--");
        // Get the base command.
        const baseCommand = args.shift();
        const command = this.getSubcommand(baseCommand);
        // Get the subcommands.
        let subcommands = null;
        if (args.length > 0) {
            subcommands = [];
            let i;
            for (i = 0; i < args.length; i++) {
                subcommands.push(this.getSubcommand(args[i]));
            }
        }
        // Return the new command.
        return new Command_1.Command(command.getName(), command.getInput(), subcommands);
    }
    /**
     * Gets a subcommand from each command.
     * @param arg The simple arg to process.
     */
    static getSubcommand(arg) {
        // Get the basic args.
        const args = arg.split(" ");
        const cmd = args.shift().toLowerCase();
        // Get the input, if there is one.
        let input = args.length > 0 ? args.join(" ") : null;
        // Trims off unneeded characters.
        if (input != null) {
            input = input.replace(new RegExp("[" + this.charlist + "]+$"), "");
            input = input.replace(new RegExp("^[" + this.charlist + "]+"), "");
        }
        // Return the subcommand.
        return new Subcommand_1.Subcommand(cmd, input);
    }
}
exports.CommandUtility = CommandUtility;
/** List of characters to trim from commands. */
CommandUtility.charlist = [" ", "\"", "'"];
//# sourceMappingURL=CommandUtility.js.map