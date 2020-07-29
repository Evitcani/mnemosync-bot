import {SpecialChannelDesignation} from "../shared/enums/SpecialChannelDesignation";
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {StringUtility} from "../backend/utilities/StringUtility";

@Entity({name: "special_channels"})
export class SpecialChannel {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column("text")
    guild_id: string;

    @Column("text")
    channel_id: string;

    @Column()
    designation: SpecialChannelDesignation;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.guild_id = StringUtility.escapeSQLInput(this.guild_id);
        this.channel_id = StringUtility.escapeSQLInput(this.channel_id);
    }
}