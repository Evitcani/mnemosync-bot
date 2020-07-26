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
import {World} from "./World";
import {GameDate} from "./GameDate";
import {User} from "./User";

@Entity({name: Table.SENDING})
export class Sending {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({name: "created_date"})
    createdDate: Date;

    @UpdateDateColumn({name: "updated_date"})
    updatedDate: Date;

    @Column({name: "world_id", nullable: true})
    worldId?: string;

    @ManyToOne(type => World, {
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "world_id"})
    world?: World;

    @Column( type => GameDate)
    inGameDate: GameDate;

    @Column("text")
    content: string;

    @Column("text", {nullable: true})
    reply?: string;

    @Column({nullable: true, name: "no_reply"})
    noReply?: boolean;

    @Column({nullable: true, name: "no_connection"})
    noConnection?: boolean;

    @Column({nullable: true, name: "is_replied"})
    isReplied?: boolean;

    @Column({name: "to_npc_id", nullable: true})
    toNpcId?: string;

    @ManyToOne(type => NonPlayableCharacter, {
        nullable: true,
        onDelete: "SET NULL",
        eager: true
    })
    @JoinColumn({name: "to_npc_id"})
    toNpc?: NonPlayableCharacter;

    @Column({name: "from_npc_id", nullable: true})
    fromNpcId?: string;

    @ManyToOne(type => NonPlayableCharacter, {
        nullable: true,
        onDelete: "SET NULL",
        eager: true
    })
    @JoinColumn({name: "from_npc_id"})
    fromNpc?: NonPlayableCharacter;

    @Column({name: "to_player_character_id", nullable: true})
    toPlayerCharacterId?: number;

    @ManyToOne(type => Character, {
        nullable: true,
        onDelete: "SET NULL",
        eager: true
    })
    @JoinColumn({name: "to_player_character_id"})
    toPlayerCharacter?: Character;

    @Column({name: "from_player_character_id", nullable: true})
    fromPlayerCharacterId?: number;

    @ManyToOne(type => Character, {
        nullable: true,
        onDelete: "SET NULL",
        eager: true
    })
    @JoinColumn({name: "from_player_character_id"})
    fromPlayerCharacter?: Character;

    @ManyToOne(type => User, {
        nullable: true,
        onDelete: "SET NULL",
        eager: true
    })
    @JoinColumn({name: "sending_message_from_user_id"})
    sendingMessageFromUser: User;

    @ManyToOne(type => User, {
        nullable: true,
        onDelete: "SET NULL",
        eager: true
    })
    @JoinColumn({name: "sending_reply_from_user_id"})
    sendingReplyFromUser: User;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.reply = StringUtility.escapeSQLInput(this.reply);
        this.content = StringUtility.escapeSQLInput(this.content);

        // Checks if the message is replied to or not.
        this.isReplied = this.reply != null || this.noConnection || this.noReply;
    }
}