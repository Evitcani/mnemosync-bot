import {TravelConfig} from "../models/TravelConfig";
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    PrimaryGeneratedColumn
} from "typeorm";
import {Party} from "./Party";
import {User} from "./User";
import {Nickname} from "./Nickname";

@Entity({name: "characters"})
export class Character {
    @PrimaryColumn("serial")
    id: number;

    @Column("text")
    img_url: string;

    @Column("text")
    name: string;

    @Column("JSON")
    travel_config: TravelConfig;

    @ManyToOne(type => Party, party => party.members, {
        eager: true
    })
    party: Party;

    @OneToMany(type => Nickname, nickname => nickname.character, {
        eager: true
    })
    nicknames: Nickname[];
}