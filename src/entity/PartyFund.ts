import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {Party} from "./Party";

@Entity({name: "party_funds"})
export class PartyFund {
    @PrimaryColumn("serial")
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