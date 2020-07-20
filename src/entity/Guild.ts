import {BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {StringUtility} from "../utilities/StringUtility";

@Entity({name: "user_to_guild"})
export class Guild {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column("text")
    discord_id: string;

    @Column("text")
    guild_id: string;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.discord_id = StringUtility.escapeMySQLInput(this.discord_id);
        this.guild_id = StringUtility.escapeMySQLInput(this.guild_id);
    }
}