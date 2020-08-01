import {PartyFundDTO} from "./PartyFundDTO";
import {DTOType} from "../DTOType";

export interface PartyDTO {
    id?: number;
    dtoType: DTOType.PARTY;
    createdDate?: Date;
    updatedDate?: Date;
    name?: string;
    guildId?: string;
    creatorDiscordId?: string;
    worldId?: string;
    currentDateId?: string;
    funds?: PartyFundDTO[];

}