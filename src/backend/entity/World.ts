import {
    BeforeInsert, BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Party} from "./Party";
import {StringUtility} from "../utilities/StringUtility";
import {NonPlayableCharacter} from "./NonPlayableCharacter";
import {TableName} from "../../shared/documentation/databases/TableName";
import {User} from "./User";
import {ColumnName} from "../../shared/documentation/databases/ColumnName";

@Entity({name: TableName.WORLD})
export class World {
    // Type of this class.
    type = "World";

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column("text",{name: ColumnName.NAME})
    name: string;

    @Column({name: ColumnName.GUILD_ID})
    guildId: string;

    @CreateDateColumn({name: ColumnName.CREATED_DATE})
    createdDate: Date;

    @UpdateDateColumn({name: ColumnName.UPDATED_DATE})
    updatedDate: Date;

    @Column("text",{name: ColumnName.MAP_URL, nullable: true})
    mapUrl: string;

    @OneToMany(type => Party, party => party.world, {
        onDelete: "SET NULL",
        nullable: true
    })
    parties?: Party[];

    @OneToMany(type => NonPlayableCharacter, character => character.world, {
        onDelete: "SET NULL",
        nullable: true
    })
    npcs?: NonPlayableCharacter[];

    @OneToMany(type => User, user => user.defaultWorld, {
        onDelete: "SET NULL",
        nullable: true
    })
    defaultOfUsers?: User[];

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.guildId = StringUtility.escapeSQLInput(this.guildId);
        this.mapUrl = StringUtility.escapeSQLInput(this.mapUrl);
        this.name = StringUtility.escapeSQLInput(this.name);
    }
}