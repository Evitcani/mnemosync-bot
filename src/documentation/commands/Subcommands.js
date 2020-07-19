"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subcommands = void 0;
const CommandStrut_1 = require("./CommandStrut");
class Subcommands {
}
exports.Subcommands = Subcommands;
Subcommands.CREATE = new CommandStrut_1.CommandStrut("create", "cr");
Subcommands.PARTY = new CommandStrut_1.CommandStrut("party", "pt");
Subcommands.SWITCH = new CommandStrut_1.CommandStrut("switch", "sw");
Subcommands.UPDATE = new CommandStrut_1.CommandStrut("update", "upd");
//# sourceMappingURL=Subcommands.js.map