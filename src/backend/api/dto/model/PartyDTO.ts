import {CurrentDateDTO} from "./CurrentDateDTO";
import {PartyFundDTO} from "./PartyFundDTO";
import {WorldDTO} from "./WorldDTO";
import {DTOType} from "../DTOType";

export interface PartyDTO {
    id?: number;
    dtoType: DTOType.PARTY;
    createdDate?: Date;
    updatedDate?: Date;
    name?: string;
    guildId?: string;
    creatorDiscordId?: string;
    world?: WorldDTO;
    funds?: PartyFundDTO[];
    currentDate?: CurrentDateDTO;
}