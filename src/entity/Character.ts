import {TravelConfig} from "./TravelConfig";
import {
    Column,
    Entity,
    ManyToOne,
    OneToMany, OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {Party} from "./Party";
import {Nickname} from "./Nickname";

@Entity({name: "characters"})
export class Character {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column("text",{ nullable: true })
    img_url?: string;

    @Column("text")
    name: string;

    @OneToOne(type => TravelConfig, travelConfig => travelConfig.character, {
        eager: true,
        nullable: true
    })
    travel_config?: TravelConfig;

    @ManyToOne(type => Party, party => party.members, {
        eager: true,
        nullable: true
    })
    party?: Party;

    @OneToMany(type => Nickname, nickname => nickname.character, {
        eager: true
    })
    nicknames: Nickname[];
}