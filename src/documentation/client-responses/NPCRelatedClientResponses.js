"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NPCRelatedClientResponses = void 0;
const BasicEmbed_1 = require("../BasicEmbed");
class NPCRelatedClientResponses {
    static DISPLAY_ALL(npcs, world) {
        let npcStr = "";
        let npc, i;
        for (i = 0; i < npcs.length; i++) {
            npc = npcs[i];
            npcStr += `[\`${i}\`] ${npc.name}\n`;
        }
        return BasicEmbed_1.BasicEmbed.get()
            .setTitle(`NPCs in the world of ${world.name}`)
            .setDescription(`The following NPCs live in ${world.name}:\n` +
            npcStr);
    }
}
exports.NPCRelatedClientResponses = NPCRelatedClientResponses;
//# sourceMappingURL=NPCRelatedClientResponses.js.map