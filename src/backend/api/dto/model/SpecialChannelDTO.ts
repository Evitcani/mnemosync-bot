import {SpecialChannelDesignation} from "../../../../shared/enums/SpecialChannelDesignation";
import {DTOType} from "../DTOType";

export class SpecialChannelDTO {
    id?: number;
    dtoType: DTOType.SPECIAL_CHANNEL;
    createdDate?: Date;
    updatedDate?: Date;
    guild_id?: string;
    channel_id?: string;
    designation?: SpecialChannelDesignation;
}