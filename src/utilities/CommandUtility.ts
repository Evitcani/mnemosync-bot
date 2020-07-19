import {Command} from "../models/generic/Command";
import {Subcommand} from "../models/generic/Subcommand";
import {Bot} from "../bot";

/**
 * A utility for processing and understanding commands.
 */
export class CommandUtility {
    /** List of characters to trim from commands. */
    private static readonly charlist = [" ", "\"", "'"];

    /**
     * Processes the commands into something legible.
     *
     * @param message The message with all the commands.
     */
    static processCommands (message: string): Command {
        // Split the args.
        const args = message.substr(Bot.PREFIX.length).split(Bot.PREFIX_SUBCOMMAND);


        // Get the base command.
        const baseCommand = args.shift();
        const command = this.getSubcommand(baseCommand);

        // Get the subcommands.
        let subcommands: Map<string, Subcommand> = null, subcommand: Subcommand;
        if (args.length > 0) {
            subcommands = new Map<string, Subcommand>();
            let i: number;
            for (i = 0; i < args.length; i++) {
                subcommand = this.getSubcommand(args[i]);
                subcommands.set(subcommand.getName(), subcommand);

            }
        }

        // Return the new command.
        return new Command(command.getName(), command.getInput(), subcommands);
    }

    /**
     * Gets a subcommand from each command.
     * @param arg The simple arg to process.
     */
    private static getSubcommand(arg: string): Subcommand {
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

        console.debug(`COMMAND UTILITY ::: New subcommand '${cmd}': ${input}`);

        // Return the subcommand.
        return new Subcommand(cmd, input);
    }
}