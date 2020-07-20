import {Character} from "./Character";
import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from "typeorm";

@Entity({name: "users"})
export class User {
    @PrimaryColumn("serial")
    id: number;

    @Column("text")
    discord_name: string;

    @Column("text")
    discord_id: string;

    @Column("int", {name: "default_character_id"})
    defaultCharacterId: number;

    @OneToOne(type => Character, {
        eager: true
    })
    @JoinColumn()
    defaultCharacter: Character;
}