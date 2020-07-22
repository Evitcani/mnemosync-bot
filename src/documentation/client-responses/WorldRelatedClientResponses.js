"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldRelatedClientResponses = void 0;
const BasicEmbed_1 = require("../BasicEmbed");
class WorldRelatedClientResponses {
    static SELECT_WORLD(worlds, action) {
        let worldStr = "";
        let world, i;
        for (i = 0; i < worlds.length; i++) {
            world = worlds[i];
            worldStr += `[\`${i}\`] ${world.name}\n`;
        }
        return BasicEmbed_1.BasicEmbed.get()
            .setTitle(`Please select which world you want to ${action} to`)
            .setDescription(`Select from the following worlds by pressing the given number:\n` +
            worldStr);
    }
}
exports.WorldRelatedClientResponses = WorldRelatedClientResponses;
//# sourceMappingURL=WorldRelatedClientResponses.js.map