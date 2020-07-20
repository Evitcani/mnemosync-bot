import {SpecialChannelDesignation} from "../enums/SpecialChannelDesignation";

export interface SpecialChannel {
    id: number;
    guild_id: string;
    channel_id: string;
    designation: SpecialChannelDesignation;
}