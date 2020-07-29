import {MessageEmbed} from "discord.js";
import {NonPlayableCharacter} from "../../../../backend/entity/NonPlayableCharacter";
import {BasicEmbed} from "../../BasicEmbed";
import {World} from "../../../../backend/entity/World";
import {NPCController} from "../../../../backend/controllers/character/NPCController";

/**
 * NPC responses to the client.
 */
export class NPCRelatedClientResponses {
    static DISPLAY_ALL(npcs: NonPlayableCharacter[], world: World, page: number): MessageEmbed {
        let npcStr = "";
        let npc, i;
        for (i = 0; i < npcs.length; i++) {
            npc = npcs[i];
            npcStr += `[\`*\`] ${npc.name}\n`;
        }

        return BasicEmbed.get()
            .setTitle(`NPCs in the world of ${world.name}`)
            .setDescription(`The following NPCs live in ${world.name}:\n` +
                npcStr)
            .setFooter(BasicEmbed.getPageFooter(page, NPCController.NPC_LIMIT, npcs.length));
    }
}