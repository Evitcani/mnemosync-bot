import {Character} from "./Character";
import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "users"})
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column("text")
    discord_name: string;

    @Column("text")
    discord_id: string;

    @Column("int", {name: "default_character_id", nullable: true})
    defaultCharacterId?: number;

    @OneToOne(type => Character, {
        eager: true,
        nullable: true
    })
    @JoinColumn()
    defaultCharacter?: Character;
}