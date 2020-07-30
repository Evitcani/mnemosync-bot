import {CurrentDateDTO} from "./CurrentDateDTO";
import {PartyFundDTO} from "./PartyFundDTO";

export class PartyDTO {
    id: number;
    createdDate: Date;
    updatedDate: Date;
    name: string;
    guildId: string;
    creatorDiscordId: string;
    funds: PartyFundDTO[];
    currentDate: CurrentDateDTO;
}