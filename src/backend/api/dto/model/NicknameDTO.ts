import {DTOType} from "../DTOType";

export interface NicknameDTO {
    id?: number;
    dtoType: DTOType.NICKNAME;
    createdDate?: Date;
    updatedDate?: Date;
    name?: string;
}