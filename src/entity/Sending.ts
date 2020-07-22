import {
    BeforeInsert, BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {NonPlayableCharacter} from "./NonPlayableCharacter";
import {Character} from "./Character";
import {Table} from "../documentation/databases/Table";
import {StringUtility} from "../utilities/StringUtility";

@Entity({name: Table.SENDING})
export class Sending {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({name: "created_date"})
    createdDate: Date;

    @UpdateDateColumn({name: "updated_date"})
    updatedDate: Date;

    @Column("text", {name: "in_game_date"})
    inGameDate: string;

    @Column("text")
    content: string;

    @Column("text", {nullable: true})
    reply?: string;

    @Column({name: "to_npc_id", nullable: true})
    toNpcId?: string;

    @ManyToOne(type => NonPlayableCharacter, {
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "to_npc_id"})
    toNpc?: NonPlayableCharacter;

    @Column({name: "from_npc_id", nullable: true})
    fromNpcId?: string;

    @ManyToOne(type => NonPlayableCharacter, {
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "from_npc_id"})
    fromNpc?: NonPlayableCharacter;

    @Column({name: "to_player_id", nullable: true})
    toPlayerId?: number;

    @ManyToOne(type => Character, {
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "to_player_id"})
    toPlayer?: Character;

    @Column({name: "from_player_id", nullable: true})
    fromPlayerId?: number;

    @ManyToOne(type => Character, {
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "from_player_id"})
    fromPlayer?: Character;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.inGameDate = StringUtility.escapeSQLInput(this.inGameDate);
        this.reply = StringUtility.escapeSQLInput(this.reply);
        this.content = StringUtility.escapeSQLInput(this.content);
    }
}