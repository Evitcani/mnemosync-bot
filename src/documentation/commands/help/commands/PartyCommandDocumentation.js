"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartyCommandDocumentation = void 0;
const BaseCommandDocumentation_1 = require("./BaseCommandDocumentation");
const Commands_1 = require("../../Commands");
const BasicEmbed_1 = require("../../../BasicEmbed");
const Subcommands_1 = require("../../Subcommands");
class PartyCommandDocumentation extends BaseCommandDocumentation_1.BaseCommandDocumentation {
    getBasicDescription() {
        return "";
    }
    getCommand() {
        return Commands_1.Commands.PARTY;
    }
    getFullDescription() {
        return BasicEmbed_1.BasicEmbed.get()
            .setTitle(` Command`);
    }
    getSubcommands() {
        let map = new Map();
        map.set(Subcommands_1.Subcommands.CREATE, ``);
        return map;
    }
}
exports.PartyCommandDocumentation = PartyCommandDocumentation;
//# sourceMappingURL=PartyCommandDocumentation.js.map