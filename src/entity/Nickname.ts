import {BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Character} from "./Character";
import {Table} from "../documentation/databases/Table";
import {StringUtility} from "../utilities/StringUtility";

@Entity({name: Table.USER_TO_CHARACTER})
export class Nickname {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column("text")
    discord_id: string;

    @Column("text")
    name: string;

    @ManyToOne(type => Character, {
        cascade: true
    })
    character: Character;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.name = StringUtility.escapeMySQLInput(this.name);
        this.discord_id = StringUtility.escapeMySQLInput(this.discord_id);
    }
}