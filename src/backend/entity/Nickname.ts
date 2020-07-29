import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Character} from "./Character";
import {TableName} from "../../shared/documentation/databases/TableName";
import {StringUtility} from "../utilities/StringUtility";

@Entity({name: TableName.USER_TO_CHARACTER})
export class Nickname {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column("text")
    discord_id: string;

    @Column("text")
    name: string;

    @Column()
    characterId: number;

    @ManyToOne(type => Character, {
        cascade: true,
        eager: true
    })
    @JoinColumn()
    character: Character;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.name = StringUtility.escapeSQLInput(this.name);
        this.discord_id = StringUtility.escapeSQLInput(this.discord_id);
    }
}