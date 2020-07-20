import {Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Character} from "./Character";
import {PartyFund} from "./PartyFund";

@Entity({name: "parties"})
export class Party {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column("text")
    name: string;

    @OneToMany(type => Character, member => member.party, { nullable: true })
    members?: Character[];

    @OneToMany(type => PartyFund, fund => fund.party)
    funds: PartyFund[];
}