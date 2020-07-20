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

    @Column({ nullable: true })
    platinum?: number;

    @Column({ nullable: true })
    gold?: number;

    @Column({ nullable: true })
    silver?: number;

    @Column({ nullable: true })
    copper?: number;
}