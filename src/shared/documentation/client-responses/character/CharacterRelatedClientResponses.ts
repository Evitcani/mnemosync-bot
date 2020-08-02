import {MessageEmbed} from "discord.js";
import {messageEmbed} from "../../messages/MessageEmbed";
import {CharacterDTO} from "@evitcani/mnemoshared/dist/src/dto/model/CharacterDTO";

export class CharacterRelatedClientResponses {
    static NOW_PLAYING_AS_CHARACTER(character: CharacterDTO, newlyCreated: boolean): MessageEmbed {
        return messageEmbed.character.now_playing_as(character, newlyCreated);
    }
}