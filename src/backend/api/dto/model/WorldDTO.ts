import {DTOType} from "../DTOType";

export interface WorldDTO {
    id?: string;
    dtoType: DTOType.WORLD;
    name?: string;
    guildId?: string;
    createdDate?: Date;
    updatedDate?: Date;
    mapUrl?: string;
}