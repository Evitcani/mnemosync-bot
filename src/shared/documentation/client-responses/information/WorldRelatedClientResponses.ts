import {MessageEmbed} from "discord.js";
import {messageEmbed} from "../../messages/MessageEmbed";
import {messageTypes} from "../../messages/MessageTypes";
import {WorldDTO} from "../../../../backend/api/dto/model/WorldDTO";

export class WorldRelatedClientResponses {
    static SELECT_WORLD(worlds: WorldDTO[], action: string): MessageEmbed {
        return messageEmbed.generic.select_from_the_following(messageTypes.world, action, worlds)
    }
}