import {CharacterDTO} from "./CharacterDTO";
import {WorldDTO} from "./WorldDTO";
import {PartyDTO} from "./PartyDTO";

export interface UserDTO {
    id?: number;
    createdDate?: Date;
    updatedDate?: Date;
    discord_name?: string;
    discord_id?: string;
    defaultCharacter?: CharacterDTO;
    defaultWorld?: WorldDTO;
    defaultParty?: PartyDTO;
}