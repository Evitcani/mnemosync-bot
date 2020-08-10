import {MessageEmbed} from "discord.js";
import {messageEmbed} from "../../messages/MessageEmbed";
import {messageTypes} from "../../messages/MessageTypes";
import {PartyDTO} from "mnemoshared/dist/src/dto/model/PartyDTO";

export class PartyRelatedClientResponses {
    static SELECT_PARTY(parties: PartyDTO[], action: string): MessageEmbed {
        return messageEmbed.generic.select_from_the_following(messageTypes.party, action, parties);
    }
}