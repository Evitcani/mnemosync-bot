import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Character} from "./Character";
import {PartyFund} from "./PartyFund";
import {StringUtility} from "../utilities/StringUtility";

@Entity({name: "parties"})
export class Party {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column("text")
    name: string;

    @Column("text", {name: "guild_id"})
    guildId: string;

    @Column("text", {name: "creator_discord_id"})
    creatorDiscordId: string;

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
        this.name = StringUtility.escapeSQLInput(this.name);
        this.guildId = StringUtility.escapeSQLInput(this.guildId);
        this.creatorDiscordId = StringUtility.escapeSQLInput(this.creatorDiscordId);
    }
}