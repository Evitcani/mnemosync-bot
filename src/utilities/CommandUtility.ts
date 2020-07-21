import {Command} from "../models/generic/Command";
import {Subcommand} from "../models/generic/Subcommand";
import {Bot} from "../bot";
import {StringUtility} from "./StringUtility";
import {Commands} from "../documentation/commands/Commands";

/**
 * A utility for processing and understanding commands.
 */
export class CommandUtility {
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
        const command = this.getCommand(baseCommand);

        // Get the subcommands.
        let subcommands: Map<string, Subcommand> = null, subcommand: Subcommand;
        if (args.length > 0) {
            subcommands = new Map<string, Subcommand>();
            let i: number;
            for (i = 0; i < args.length; i++) {
                subcommand = this.getSubcommand(args[i], command.isMoneyRelated);
                subcommands.set(subcommand.getName(), subcommand);

            }
        }

        // Return the new command.
        return new Command(command.subcommand.getName(), command.subcommand.getInput(), subcommands);
    }

    /**
     * Gets a subcommand from each command.
     * @param arg The simple arg to process.
     * @param isMoneyRelated
     */
    private static getSubcommand(arg: string, isMoneyRelated: boolean): Subcommand {
        // Get the basic args.
        const args = arg.split(" ");
        const cmd = args.shift().toLowerCase();

        // Get the input, if there is one.
        let input = args.length > 0 ? args.join(" ") : null;
        input = StringUtility.processUserInput(input);

        // Formats the money.
        if (isMoneyRelated) {
            input = StringUtility.formatFundInput(input);
        }

        console.debug(`COMMAND UTILITY ::: New subcommand '${cmd}': ${input}`);

        // Return the subcommand.
        return new Subcommand(cmd, input);
    }

    private static getCommand(arg: string): {subcommand: Subcommand, isMoneyRelated: boolean} {
        // Get the basic args.
        const args = arg.split(" ");
        const cmd = args.shift().toLowerCase();

        // It's money related!
        if (cmd == Commands.FUND || cmd == Commands.BANK) {
            return {subcommand: this.getSubcommand(arg, true), isMoneyRelated: true};
        }

        // Not money related.
        return {subcommand: this.getSubcommand(arg, false), isMoneyRelated: false};
    }
}