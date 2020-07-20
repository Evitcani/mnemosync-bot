import {SpecialChannelDesignation} from "../enums/SpecialChannelDesignation";
import {BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {StringUtility} from "../utilities/StringUtility";

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

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.guild_id = StringUtility.escapeMySQLInput(this.guild_id);
        this.channel_id = StringUtility.escapeMySQLInput(this.channel_id);
    }
}