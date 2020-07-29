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
import {World} from "./World";
import {Table} from "../shared/documentation/databases/Table";
import {StringUtility} from "../backend/utilities/StringUtility";

@Entity({name: Table.NPC})
export class NonPlayableCharacter {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column("text")
    name: string;

    @CreateDateColumn({name: "created_date"})
    createdDate: Date;

    @UpdateDateColumn({name: "updated_date"})
    updatedDate: Date;

    @Column({nullable: true, name: "world_id"})
    worldId?: string;

    @ManyToOne(type => World, world => world.npcs, {
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "world_id"})
    world?: World;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.name = StringUtility.escapeSQLInput(this.name);
    }
}