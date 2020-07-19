"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subcommands = void 0;
const CommandStrut_1 = require("./CommandStrut");
class Subcommands {
}
exports.Subcommands = Subcommands;
Subcommands.CREATE = new CommandStrut_1.CommandStrut("create", "cr");
Subcommands.DRINKS = new CommandStrut_1.CommandStrut("drinks", null);
Subcommands.EATS = new CommandStrut_1.CommandStrut("eats", null);
Subcommands.IMG_URL = new CommandStrut_1.CommandStrut("image-url", "img");
Subcommands.PARTY = new CommandStrut_1.CommandStrut("party", "pt");
Subcommands.SWITCH = new CommandStrut_1.CommandStrut("switch", "sw");
Subcommands.UPDATE = new CommandStrut_1.CommandStrut("update", "upd");
Subcommands.WEIGHT = new CommandStrut_1.CommandStrut("weight", "wt");
Subcommands.WEIGHT_INVENTORY = new CommandStrut_1.CommandStrut("inventory-weight", "inv-wt");
//# sourceMappingURL=Subcommands.js.map