import {DTOType} from "../DTOType";
import {DateDTO} from "./DateDTO";
import {CharacterDTO} from "./CharacterDTO";

export interface SendingDTO {
    id?: string;
    dtoType: DTOType.SENDING;
    createdDate?: Date;
    updatedDate?: Date;
    worldId?: string;
    inGameDate?: DateDTO;
    content?: string;
    reply?: string;
    noReply?: boolean | null;
    noConnection?: boolean | null;
    isReplied?: boolean | null;
    toCharacterId?: string;
    toCharacter?: CharacterDTO;
    fromCharacterId?: string;
    fromCharacter?: CharacterDTO;
    sendingMessageFromDiscordId?: string;
    sendingMessageFromDiscordName?: string;
    sendingReplyFromDiscordId?: string;
    sendingReplyFromDiscordName?: string;
}