import {Command} from "../../models/generic/Command";
import {Subcommand} from "../../models/generic/Subcommand";

export class CommandStrut {
    private readonly _name: string;
    private readonly _shortenedName: string;

    constructor(name: string, shortenedName: string) {
        this._name = name;
        this._shortenedName = shortenedName;
    }

    get name(): string {
        return this._name;
    }

    get shortenedName(): string {
        return this._shortenedName;
    }

    public isCommand(command: Command): Subcommand {
        if (command == null || command.getSubcommands() == null) {
            return null;
        }
        let cmd = command.getSubcommands().get(this.name);
        if (cmd != null) {
            return cmd;
        }

        return this.shortenedName == null ? null : command.getSubcommands().get(this.shortenedName);
    }
}