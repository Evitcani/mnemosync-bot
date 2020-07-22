"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subcommands = void 0;
const CommandStrut_1 = require("./CommandStrut");
class Subcommands {
}
exports.Subcommands = Subcommands;
Subcommands.CREATE = new CommandStrut_1.CommandStrut("create", "cr");
Subcommands.DATE = new CommandStrut_1.CommandStrut("date", "dt");
Subcommands.DRINKS = new CommandStrut_1.CommandStrut("drinks", null);
Subcommands.EATS = new CommandStrut_1.CommandStrut("eats", null);
Subcommands.FROM = new CommandStrut_1.CommandStrut("from", null);
Subcommands.FROM_NPC = new CommandStrut_1.CommandStrut("from-npc", "fromn");
Subcommands.IMG_URL = new CommandStrut_1.CommandStrut("image-url", "img");
Subcommands.NEXT = new CommandStrut_1.CommandStrut("next", "n");
Subcommands.NICKNAME = new CommandStrut_1.CommandStrut("nickname", "nick");
Subcommands.NPC = new CommandStrut_1.CommandStrut("npc", null);
Subcommands.MESSAGE = new CommandStrut_1.CommandStrut("message", "msg");
Subcommands.PARTY = new CommandStrut_1.CommandStrut("party", "pt");
Subcommands.READ = new CommandStrut_1.CommandStrut("read", null);
Subcommands.REPLY = new CommandStrut_1.CommandStrut("reply", null);
Subcommands.SWITCH = new CommandStrut_1.CommandStrut("switch", "sw");
Subcommands.TO = new CommandStrut_1.CommandStrut("to", null);
Subcommands.TO_NPC = new CommandStrut_1.CommandStrut("to-npc", "ton");
Subcommands.UPDATE = new CommandStrut_1.CommandStrut("update", "upd");
Subcommands.WEIGHT = new CommandStrut_1.CommandStrut("weight", "wt");
Subcommands.WEIGHT_INVENTORY = new CommandStrut_1.CommandStrut("inventory-weight", "inv-wt");
Subcommands.WORLD = new CommandStrut_1.CommandStrut("world", null);
//# sourceMappingURL=Subcommands.js.map