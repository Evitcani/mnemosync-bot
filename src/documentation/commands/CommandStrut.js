"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandStrut = void 0;
class CommandStrut {
    constructor(name, shortenedName) {
        this._name = name;
        this._shortenedName = shortenedName;
    }
    get name() {
        return this._name;
    }
    get shortenedName() {
        return this._shortenedName;
    }
    getCommand(command) {
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
    isCommand(command) {
        return this.getCommand(command) != null;
    }
}
exports.CommandStrut = CommandStrut;
//# sourceMappingURL=CommandStrut.js.map