import {MessageEmbed} from "discord.js";
import {NonPlayableCharacter} from "../../entity/NonPlayableCharacter";
import {BasicEmbed} from "../BasicEmbed";
import {World} from "../../entity/World";

export class NPCRelatedClientResponses {
    static DISPLAY_ALL(npcs: NonPlayableCharacter[], world: World): MessageEmbed {
        let npcStr = "";
        let npc, i;
        for (i = 0; i < npcs.length; i++) {
            npc = npcs[i];
            npcStr += `[\`${i}\`] ${npc.name}\n`;
        }

        return BasicEmbed.get()
            .setTitle(`NPCs in the world of ${world.name}`)
            .setDescription(`The following NPCs live in ${world.name}:\n` +
                npcStr);
    }
}