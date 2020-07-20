import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Character} from "./Character";
import {PartyFund} from "./PartyFund";

@Entity({name: "parties"})
export class Party {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column("text")
    name: string;

    @Column("text", {name: "guild_id"})
    guildId: string;

    @OneToMany(type => Character, member => member.party, {
        nullable: true,
        onDelete: "SET NULL"
    })
    members?: Character[];

    @OneToMany(type => PartyFund, fund => fund.party, {
        onDelete: "SET NULL"
    })
    funds: PartyFund[];
}