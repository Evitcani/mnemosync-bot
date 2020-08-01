import {NicknameDTO} from "./NicknameDTO";
import {DTOType} from "../DTOType";

export interface CharacterDTO {
    id?: string;
    dtoType: DTOType.CHARACTER;
    createdDate?: Date;
    updatedDate?: Date;
    img_url?: string;
    isNpc?: boolean
    name?: string;
    partyId?: number;
    worldId?: string;
    nicknames?: NicknameDTO[];
}