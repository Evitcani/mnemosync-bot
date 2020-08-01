import {DTOType} from "../DTOType";

export interface UserDTO {
    id?: number;
    dtoType: DTOType.USER;
    createdDate?: Date;
    updatedDate?: Date;
    discord_name?: string;
    discord_id?: string;
    defaultCharacterId?: string;
    defaultWorldId?: string;
    defaultPartyId?: number;
}