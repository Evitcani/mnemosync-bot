import {MessageEmbed} from "discord.js";
import {World} from "../../../../backend/entity/World";
import {messageEmbed} from "../../messages/MessageEmbed";
import {messageTypes} from "../../messages/MessageTypes";

export class WorldRelatedClientResponses {
    static SELECT_WORLD(worlds: World[], action: string): MessageEmbed {
        return messageEmbed.generic.select_from_the_following(messageTypes.world, action, worlds)
    }
}