import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity, JoinColumn, ManyToOne,
    OneToMany, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Character} from "./Character";
import {PartyFund} from "./PartyFund";
import {StringUtility} from "../utilities/StringUtility";
import {World} from "./World";
import {CurrentDate} from "./CurrentDate";
import {TableName} from "../../shared/documentation/databases/TableName";

@Entity({name: TableName.PARTY})
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
        onDelete: "SET NULL",
        eager: true
    })
    funds: PartyFund[];

    @ManyToOne(type => World, campaign => campaign.parties, {
        eager: true,
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "world_id"})
    world?: World;

    @OneToOne(type => CurrentDate, date => date.party, {
        onDelete: "SET NULL",
        nullable: true,
        eager: true
    })
    @JoinColumn({name: "current_date_id"})
    currentDate: CurrentDate;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.name = StringUtility.escapeSQLInput(this.name);
        this.guildId = StringUtility.escapeSQLInput(this.guildId);
        this.creatorDiscordId = StringUtility.escapeSQLInput(this.creatorDiscordId);
    }
}