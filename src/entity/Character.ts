import {TravelConfig} from "./TravelConfig";
import {
    BeforeInsert, BeforeUpdate,
    Column, CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany, OneToOne,
    PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import {Party} from "./Party";
import {Nickname} from "./Nickname";
import {StringUtility} from "../utilities/StringUtility";

@Entity({name: "characters"})
export class Character {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column("text",{ nullable: true })
    img_url?: string;

    @Column("text")
    name: string;

    @OneToOne(type => TravelConfig, travelConfig => travelConfig.character, {
        eager: true,
        nullable: true,
        onDelete: "SET NULL"
    })
    travel_config?: TravelConfig;

    @ManyToOne(type => Party, party => party.members, {
        eager: true,
        nullable: true,
        onDelete: "SET NULL"
    })
    party?: Party;

    @OneToMany(type => Nickname, nickname => nickname.character, {
        eager: true,
        onDelete: "SET NULL"
    })
    nicknames: Nickname[];

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.name = StringUtility.escapeSQLInput(this.name);
        this.img_url = StringUtility.escapeSQLInput(this.img_url);
    }
}