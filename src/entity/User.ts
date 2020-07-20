import {Character} from "./Character";
import {BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {StringUtility} from "../utilities/StringUtility";

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

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.discord_name = StringUtility.escapeMySQLInput(this.discord_name);
        this.discord_id = StringUtility.escapeMySQLInput(this.discord_id);
    }
}