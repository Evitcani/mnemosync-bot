import {Character} from "./Character";
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn, JoinTable, ManyToMany, ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import {StringUtility} from "../utilities/StringUtility";
import {Party} from "./Party";
import {World} from "./World";

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

    @ManyToOne(type => Character, character => character.defaultUsers, {
        eager: true,
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "default_character_id"})
    defaultCharacter: Character;

    @Column({name: "default_world_id"})
    defaultWorldId: string;

    @ManyToOne(type => World, world => world.defaultOfUsers, {
        eager: true,
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "default_world_id"})
    defaultWorld: World;

    @ManyToMany(type => World)
    @JoinTable({name: "world_owners_to_users"})
    campaignsDMing: World[];

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.discord_name = StringUtility.escapeSQLInput(this.discord_name);
        this.discord_id = StringUtility.escapeSQLInput(this.discord_id);
    }
}