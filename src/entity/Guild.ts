import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {StringUtility} from "../utilities/StringUtility";

@Entity({name: "user_to_guild"})
export class Guild {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column("text")
    discord_id: string;

    @Column("text")
    guild_id: string;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.discord_id = StringUtility.escapeSQLInput(this.discord_id);
        this.guild_id = StringUtility.escapeSQLInput(this.guild_id);
    }
}