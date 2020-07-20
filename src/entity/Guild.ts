import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "user_to_guild"})
export class Guild {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column("text")
    discord_id: string;

    @Column("text")
    guild_id: string;
}