import {MessageEmbed} from "discord.js";
import {Character} from "../../../../backend/entity/Character";
import {messageEmbed} from "../../messages/MessageEmbed";

export class CharacterRelatedClientResponses {
    static NOW_PLAYING_AS_CHARACTER(character: Character, newlyCreated: boolean): MessageEmbed {
        return messageEmbed.character.now_playing_as(character, newlyCreated);
    }
}