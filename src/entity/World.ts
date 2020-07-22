import {
    BeforeInsert, BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity, JoinTable, ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Party} from "./Party";
import {StringUtility} from "../utilities/StringUtility";
import {NonPlayableCharacter} from "./NonPlayableCharacter";
import {Table} from "../documentation/databases/Table";
import {User} from "./User";

@Entity({name: Table.WORLD})
export class World {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column("text",{name: "name"})
    name: string;

    @Column({name: "guild_id"})
    guildId: string;

    @CreateDateColumn({name: "created_date"})
    createdDate: Date;

    @UpdateDateColumn({name: "updated_date"})
    updatedDate: Date;

    @Column("text",{name: "map_url"})
    mapUrl: string;

    @OneToMany(type => Party, party => party.world, {
        onDelete: "SET NULL"
    })
    parties?: Party[];

    @OneToMany(type => NonPlayableCharacter, character => character.world, {
        onDelete: "SET NULL"
    })
    npcs?: NonPlayableCharacter[];

    @OneToMany(type => User, user => user.defaultWorld, {
        onDelete: "SET NULL"
    })
    defaultOfUsers?: User[];

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.guildId = StringUtility.escapeSQLInput(this.guildId);
        this.mapUrl = StringUtility.escapeSQLInput(this.mapUrl);
    }
}