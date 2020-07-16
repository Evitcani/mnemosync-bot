import {Subcommand} from "./Subcommand";

/**
 * A command to manage what the user wants to happen.
 */
export class Command extends Subcommand {
    /** A list of the subcommands in this command. */
    protected subcommands: Subcommand[] | null;

    constructor(name: string, input: string | null, subcommands: Subcommand[] | null) {
        super(name, input);
        this.subcommands = subcommands;
    }
}