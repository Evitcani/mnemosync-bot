import {
    BeforeInsert, BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {World} from "./World";
import {CalendarMonth} from "./CalendarMonth";
import {CalendarWeekDay} from "./CalendarWeekDay";
import {CalendarMoon} from "./CalendarMoon";
import {CalendarEra} from "./CalendarEra";
import {GameDate} from "./GameDate";
import {Table} from "../documentation/databases/Table";
import {StringUtility} from "../utilities/StringUtility";

@Entity({name: Table.CALENDAR})
export class Calendar {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({name: "created_date"})
    createdDate: Date;

    @UpdateDateColumn({name: "updated_date"})
    updatedDate: Date;

    @Column()
    name: string;

    @Column({name: "year_length_days"})
    yearLength: number;

    @Column({nullable: true})
    description: string;

    @Column(type => GameDate)
    epoch: GameDate;

    @Column({name: "world_id"})
    worldId: string;

    @ManyToOne(type => World, {
        cascade: true
    })
    @JoinColumn({name: "world_id"})
    world: World;

    @OneToMany(type => CalendarEra, era => era.calendar, {
            onDelete: "SET NULL",
            nullable: true
        })
    eras?: CalendarEra[];

    @OneToMany(type => CalendarMonth, month => month.calendar, {
        onDelete: "SET NULL",
        nullable: true
    })
    months?: CalendarMonth[];

    @OneToMany(type => CalendarWeekDay, day => day.calendar, {
        onDelete: "SET NULL",
        nullable: true
    })
    week?: CalendarWeekDay[];

    @OneToMany(type => CalendarMoon, moon => moon.calendar, {
        onDelete: "SET NULL",
        nullable: true
    })
    moons?: CalendarMoon[];

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.name = StringUtility.escapeSQLInput(this.name);
        this.description = StringUtility.escapeSQLInput(this.description);
    }
}