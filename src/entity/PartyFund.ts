import {Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Party} from "./Party";

@Entity({name: "party_funds"})
export class PartyFund {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => Party, party => party.funds)
    party: Party;

    @Column("text")
    type: string;

    @Column()
    platinum: number;

    @Column()
    gold: number;

    @Column()
    silver: number;

    @Column()
    copper: number;
}