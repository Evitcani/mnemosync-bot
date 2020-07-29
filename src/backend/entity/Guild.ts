import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {StringUtility} from "../utilities/StringUtility";
import {TableName} from "../../shared/documentation/databases/TableName";

@Entity({name: TableName.USER_TO_GUILD})
export class Guild {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column("text")
    discord_id: string;

    @Column("text")
    guild_id: string;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.discord_id = StringUtility.escapeSQLInput(this.discord_id);
        this.guild_id = StringUtility.escapeSQLInput(this.guild_id);
    }
}