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
import {World} from "../World";
import {CalendarMonth} from "./CalendarMonth";
import {CalendarWeekDay} from "./CalendarWeekDay";
import {CalendarMoon} from "./CalendarMoon";
import {CalendarEra} from "./CalendarEra";
import {GameDate} from "../GameDate";
import {TableName} from "../../../shared/documentation/databases/TableName";
import {StringUtility} from "../../utilities/StringUtility";
import {ColumnName} from "../../../shared/documentation/databases/ColumnName";

@Entity({name: TableName.CALENDAR})
export class Calendar {
    @PrimaryGeneratedColumn('uuid', {name: ColumnName.ID})
    id: string;

    @CreateDateColumn({name: ColumnName.CREATED_DATE})
    createdDate: Date;

    @UpdateDateColumn({name: ColumnName.UPDATED_DATE})
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