import {PartyDTO} from "./PartyDTO";
import {DTOType} from "../DTOType";

export interface PartyFundDTO {
    id?: number;
    dtoType: DTOType.PARTY_FUND;
    createdDate?: Date;
    updatedDate?: Date;
    type?: string;
    platinum?: number;
    party?: PartyDTO;
    gold?: number;
    silver?: number;
    copper?: number;
    isNegative?: boolean;
}