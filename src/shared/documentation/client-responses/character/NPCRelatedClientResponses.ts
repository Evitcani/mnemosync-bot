import {MessageEmbed} from "discord.js";
import {BasicEmbed} from "../../BasicEmbed";
import {messageResponse} from "../../messages/MessageResponse";
import {SendingController} from "../../../../backend/controllers/character/SendingController";
import {CharacterDTO} from "@evitcani/mnemoshared/dist/src/dto/model/CharacterDTO";
import {WorldDTO} from "@evitcani/mnemoshared/dist/src/dto/model/WorldDTO";

/**
 * NPC responses to the client.
 */
export class NPCRelatedClientResponses {
    static DISPLAY_ALL(npcs: CharacterDTO[], world: WorldDTO, page: number): MessageEmbed {
        return BasicEmbed.get()
            .setTitle(messageResponse.npc.display_all.title(world.name))
            .setDescription(messageResponse.npc.display_all.desc(world.name, npcs))
            .setFooter(BasicEmbed.getPageFooter(page, SendingController.SENDING_LIMIT, npcs.length));
    }
}