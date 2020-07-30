import {PartyDTO} from "./PartyDTO";
import {NicknameDTO} from "./NicknameDTO";

export interface CharacterDTO {
    id?: number;
    createdDate?: Date;
    updatedDate?: Date;
    img_url?: string;
    name?: string;
    party?: PartyDTO;
    nicknames?: NicknameDTO[];
}