import {CurrentDateDTO} from "./CurrentDateDTO";
import {PartyFundDTO} from "./PartyFundDTO";
import {WorldDTO} from "./WorldDTO";

export interface PartyDTO {
    id?: number;
    createdDate?: Date;
    updatedDate?: Date;
    name?: string;
    guildId?: string;
    creatorDiscordId?: string;
    world?: WorldDTO;
    funds?: PartyFundDTO[];
    currentDate?: CurrentDateDTO;
}