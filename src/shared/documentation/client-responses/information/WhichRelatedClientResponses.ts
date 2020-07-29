import {MessageEmbed} from "discord.js";
import {Party} from "../../../../backend/entity/Party";
import {messageEmbed} from "../../messages/MessageEmbed";
import {messageTypes} from "../../messages/MessageTypes";
import {messageResponse} from "../../messages/MessageResponse";

export class WhichRelatedClientResponses {
    static LIST_ALL_PARTIES (parties: Party[]): MessageEmbed {
        return messageEmbed.generic.display_all(messageTypes.party, messageTypes.server,
            messageResponse.party.command.create, parties);
    }
}