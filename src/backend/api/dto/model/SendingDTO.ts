import {DTOType} from "../DTOType";
import {DateDTO} from "./DateDTO";

export interface SendingDTO {
    id?: string;
    dtoType: DTOType.SENDING;
    createdDate: Date;
    updatedDate: Date;
    worldId?: string;
    inGameDate: DateDTO;
    content: string;
    reply?: string;
    noReply?: boolean | null;
    noConnection?: boolean | null;
    isReplied?: boolean | null;
    toCharacterId?: string;
    fromCharacterId?: string;
    sendingMessageFromDiscordId: string;
    sendingReplyFromDiscordId: string;
}