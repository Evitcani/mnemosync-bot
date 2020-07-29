"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NPCRelatedClientResponses = void 0;
const BasicEmbed_1 = require("../../BasicEmbed");
const NPCController_1 = require("../../../../backend/controllers/character/NPCController");
/**
 * NPC responses to the client.
 */
class NPCRelatedClientResponses {
    static DISPLAY_ALL(npcs, world, page) {
        let npcStr = "";
        let npc, i;
        for (i = 0; i < npcs.length; i++) {
            npc = npcs[i];
            npcStr += `[\`*\`] ${npc.name}\n`;
        }
        return BasicEmbed_1.BasicEmbed.get()
            .setTitle(`NPCs in the world of ${world.name}`)
            .setDescription(`The following NPCs live in ${world.name}:\n` +
            npcStr)
            .setFooter(BasicEmbed_1.BasicEmbed.getPageFooter(page, NPCController_1.NPCController.NPC_LIMIT, npcs.length));
    }
}
exports.NPCRelatedClientResponses = NPCRelatedClientResponses;
//# sourceMappingURL=NPCRelatedClientResponses.js.map