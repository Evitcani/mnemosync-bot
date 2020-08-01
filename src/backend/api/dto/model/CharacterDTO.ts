import {NicknameDTO} from "./NicknameDTO";
import {DTOType} from "../DTOType";

export interface CharacterDTO {
    id?: number;
    dtoType: DTOType.CHARACTER;
    createdDate?: Date;
    updatedDate?: Date;
    img_url?: string;
    name?: string;
    partyId?: number;
    nicknames?: NicknameDTO[];
}