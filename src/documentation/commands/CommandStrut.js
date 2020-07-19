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
    isCommand(command) {
        let cmd = command.getSubcommands().get(this.name);
        if (cmd != null) {
            return cmd;
        }
        return this.shortenedName == null ? null : command.getSubcommands().get(this.shortenedName);
    }
}
exports.CommandStrut = CommandStrut;
//# sourceMappingURL=CommandStrut.js.map