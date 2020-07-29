import {Subcommand} from "../../models/generic/Subcommand";
import {Command} from "../../models/generic/Command";

export class CommandStrut {
    private readonly _name: string;
    private readonly _shortenedName: string;
    private readonly _args: Map<string, string>;

    constructor(name: string, shortenedName: string, args: Map<string, string>) {
        this._name = name;
        this._shortenedName = shortenedName;
        this._args = args;
    }

    get args(): Map<string, string> {
        return this._args;
    }

    get name(): string {
        return this._name;
    }

    get shortenedName(): string {
        return this._shortenedName;
    }

    public getCommand(command: Command): Subcommand {
        if (command == null || command.getSubcommands() == null) {
            return null;
        }
        let cmd = command.getSubcommands().get(this.name);
        if (cmd != null) {
            return cmd;
        }

        return this.shortenedName == null ? null : command.getSubcommands().get(this.shortenedName);
    }

    /**
     * Gets if this subcommand exists in the command array.
     *
     * @param command The command to check for.
     */
    public isCommand(command: Command): boolean {
        return this.getCommand(command) != null;
    }
}