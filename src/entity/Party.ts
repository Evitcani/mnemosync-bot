import {BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Character} from "./Character";
import {PartyFund} from "./PartyFund";
import {StringUtility} from "../utilities/StringUtility";

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

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.name = StringUtility.escapeMySQLInput(this.name);
        this.guildId = StringUtility.escapeMySQLInput(this.guildId);
    }
}