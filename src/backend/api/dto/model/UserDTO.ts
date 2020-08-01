import {CharacterDTO} from "./CharacterDTO";
import {WorldDTO} from "./WorldDTO";
import {PartyDTO} from "./PartyDTO";
import {DTOType} from "../DTOType";

export interface UserDTO {
    id?: number;
    dtoType: DTOType.USER;
    createdDate?: Date;
    updatedDate?: Date;
    discord_name?: string;
    discord_id?: string;
    defaultCharacter?: CharacterDTO;
    defaultWorld?: WorldDTO;
    defaultParty?: PartyDTO;
}