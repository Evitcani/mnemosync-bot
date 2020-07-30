import {Nickname} from "../../entity/Nickname";
import {PartyDTO} from "./PartyDTO";

export class CharacterDTO {
    id: number;
    createdDate: Date;
    updatedDate: Date;
    img_url?: string;
    name: string;
    party?: PartyDTO;
    nicknames: Nickname[];
}