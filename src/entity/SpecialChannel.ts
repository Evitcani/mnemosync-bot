import {SpecialChannelDesignation} from "../enums/SpecialChannelDesignation";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "special_channels"})
export class SpecialChannel {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column("text")
    guild_id: string;

    @Column("text")
    channel_id: string;

    @Column()
    designation: SpecialChannelDesignation;
}