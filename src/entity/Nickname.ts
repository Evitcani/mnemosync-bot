import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Character} from "./Character";
import {Table} from "../documentation/databases/Table";

@Entity({name: Table.USER_TO_CHARACTER})
export class Nickname {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column("text")
    discord_id: string;

    @Column("text")
    name: string;

    @ManyToOne(type => Character)
    character: Character;
}