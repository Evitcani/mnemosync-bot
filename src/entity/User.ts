import {Character} from "./Character";
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import {StringUtility} from "../utilities/StringUtility";

@Entity({name: "users"})
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column("text")
    discord_name: string;

    @Column("text")
    discord_id: string;

    @Column("int", {name: "default_character_id", nullable: true})
    defaultCharacterId?: number;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.discord_name = StringUtility.escapeSQLInput(this.discord_name);
        this.discord_id = StringUtility.escapeSQLInput(this.discord_id);
    }
}