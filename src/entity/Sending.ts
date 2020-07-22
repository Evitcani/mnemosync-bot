import {
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

    @Column("text")
    reply: string;

    @Column({name: "to_npc_id"})
    toNpcId?: string;

    @ManyToOne(type => NonPlayableCharacter, {
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "to_npc_id"})
    toNpc?: NonPlayableCharacter;

    @Column({name: "from_npc_id"})
    fromNpcId?: string;

    @ManyToOne(type => NonPlayableCharacter, {
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "from_npc_id"})
    fromNpc?: NonPlayableCharacter;

    @Column({name: "to_player_id"})
    toPlayerId?: number;

    @ManyToOne(type => Character, {
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "to_player_id"})
    toPlayer?: Character;

    @Column({name: "from_player_id"})
    fromPlayerId?: number;

    @ManyToOne(type => Character, {
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "from_player_id"})
    fromPlayer?: Character;
}