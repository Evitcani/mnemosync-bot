"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subcommand = void 0;
/**
 * A subcommand of the command.
 */
class Subcommand {
    constructor(name, input) {
        this.name = name;
        this.input = input;
    }
    /**
     * Gets the name of this command.
     */
    getName() {
        return this.name;
    }
    /**
     * Gets the input provided by the user, if there is one.
     */
    getInput() {
        return this.input;
    }
}
exports.Subcommand = Subcommand;
//# sourceMappingURL=Subcommand.js.map