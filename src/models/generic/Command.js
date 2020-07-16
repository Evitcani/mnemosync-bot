"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const Subcommand_1 = require("./Subcommand");
/**
 * A command to manage what the user wants to happen.
 */
class Command extends Subcommand_1.Subcommand {
    constructor(name, input, subcommands) {
        super(name, input);
        this.subcommands = subcommands;
    }
}
exports.Command = Command;
//# sourceMappingURL=Command.js.map