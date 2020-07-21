import {TravelConfig} from "./TravelConfig";
import {
    BeforeInsert, BeforeUpdate,
    Column, CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    OneToMany, OneToOne,
    PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import {Party} from "./Party";
import {Nickname} from "./Nickname";
import {StringUtility} from "../utilities/StringUtility";
import {User} from "./User";

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
    @JoinColumn()
    travel_config?: TravelConfig;

    @Column({nullable: true})
    partyId?: number;

    @ManyToOne(type => Party, party => party.members, {
        eager: true,
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn()
    party?: Party;

    @OneToMany(type => Nickname, nickname => nickname.character, {
        onDelete: "SET NULL"
    })
    nicknames: Nickname[];

    @OneToMany(type => User, user => user.defaultCharacter, {
        onDelete: "SET NULL"
    })
    defaultUsers: User[];

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.name = StringUtility.escapeSQLInput(this.name);
        this.img_url = StringUtility.escapeSQLInput(this.img_url);
    }
}