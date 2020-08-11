import {MessageEmbed} from "discord.js";
import {messageEmbed} from "../../messages/MessageEmbed";
import {messageTypes} from "../../messages/MessageTypes";
import {messageResponse} from "../../messages/MessageResponse";
import {PartyDTO} from "mnemoshared/dist/src/dto/model/PartyDTO";

export class WhichRelatedClientResponses {
    static LIST_ALL_PARTIES (parties: PartyDTO[]): MessageEmbed {
        return messageEmbed.generic.display_all(messageTypes.party, messageTypes.server,
            messageResponse.party.command.create, parties);
    }
}