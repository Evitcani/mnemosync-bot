"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subcommands = void 0;
const CommandStrut_1 = require("./CommandStrut");
const Commands_1 = require("./Commands");
class Subcommands {
}
exports.Subcommands = Subcommands;
Subcommands.CREATE = new CommandStrut_1.CommandStrut("create", "cr", new Map()
    .set(Commands_1.Commands.DATE, "calendar existing name")
    .set(Commands_1.Commands.CHARACTER, "name of new character")
    .set(Commands_1.Commands.WORLD, "name of new world"));
Subcommands.DATE = new CommandStrut_1.CommandStrut("date", "dt", new Map()
    .set(Commands_1.Commands.DATE, "(# day)/(# month)/(# year)")
    .set(Commands_1.Commands.SENDING, "(# day)/(# month)/(# year)"));
Subcommands.DONJON = new CommandStrut_1.CommandStrut("donjon", "donj", new Map()
    .set(Commands_1.Commands.CALENDAR, "json from donjon export"));
Subcommands.DRINKS = new CommandStrut_1.CommandStrut("drinks", null, new Map());
Subcommands.EATS = new CommandStrut_1.CommandStrut("eats", null, new Map());
Subcommands.FROM = new CommandStrut_1.CommandStrut("from", null, new Map()
    .set(Commands_1.Commands.SENDING, "name of NPC character"));
Subcommands.GET = new CommandStrut_1.CommandStrut("get", "g", new Map());
Subcommands.IMG_URL = new CommandStrut_1.CommandStrut("image-url", "img", new Map()
    .set(Commands_1.Commands.CHARACTER, "url for an image to display"));
Subcommands.NAME = new CommandStrut_1.CommandStrut("name", "nm", new Map()
    .set(Commands_1.Commands.CALENDAR, "name for new calendar"));
Subcommands.NEXT = new CommandStrut_1.CommandStrut("next", "n", new Map()
    .set(Commands_1.Commands.WHICH, "number of page to go to"));
Subcommands.NICKNAME = new CommandStrut_1.CommandStrut("nickname", "nick", new Map()
    .set(Commands_1.Commands.CHARACTER, "nickname for character"));
Subcommands.NPC = new CommandStrut_1.CommandStrut("npc", null, new Map());
Subcommands.MESSAGE = new CommandStrut_1.CommandStrut("message", "msg", new Map()
    .set(Commands_1.Commands.SENDING, "message content"));
Subcommands.PARTY = new CommandStrut_1.CommandStrut("party", "pt", new Map()
    .set(Commands_1.Commands.REGISTER, "new party name")
    .set(Commands_1.Commands.DATE, "existing party name")
    .set(Commands_1.Commands.WORLD, "existing party name"));
Subcommands.READ = new CommandStrut_1.CommandStrut("read", null, new Map());
Subcommands.REPLY = new CommandStrut_1.CommandStrut("reply", null, new Map()
    .set(Commands_1.Commands.SENDING, "# id of message"));
Subcommands.SWITCH = new CommandStrut_1.CommandStrut("switch", "sw", new Map()
    .set(Commands_1.Commands.CHARACTER, "existing character name | none to remove default")
    .set(Commands_1.Commands.PARTY, "existing party name | none to remove default")
    .set(Commands_1.Commands.WORLD, "existing world name | none to remove default"));
Subcommands.TO = new CommandStrut_1.CommandStrut("to", null, new Map()
    .set(Commands_1.Commands.SENDING, "player character name"));
Subcommands.TO_NPC = new CommandStrut_1.CommandStrut("to-npc", "ton", new Map()
    .set(Commands_1.Commands.SENDING, "NPC name"));
Subcommands.UPDATE = new CommandStrut_1.CommandStrut("update", "upd", new Map()
    .set("", ""));
Subcommands.WEIGHT = new CommandStrut_1.CommandStrut("weight", "wt", new Map()
    .set("", ""));
Subcommands.WEIGHT_INVENTORY = new CommandStrut_1.CommandStrut("inventory-weight", "inv-wt", new Map()
    .set("", ""));
Subcommands.WORLD = new CommandStrut_1.CommandStrut("world", null, new Map()
    .set("", ""));
Subcommands.WORLD_ANVIL = new CommandStrut_1.CommandStrut("world-anvil", "wa", new Map()
    .set(Commands_1.Commands.CALENDAR, "json from World Anvil calendar export"));
//# sourceMappingURL=Subcommands.js.map