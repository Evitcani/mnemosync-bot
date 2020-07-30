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
import {Calendar} from "./Calendar";
import {TableName} from "../../../shared/documentation/databases/TableName";
import {StringUtility} from "../../utilities/StringUtility";
import {CalendarMoonPhase} from "./CalendarMoonPhase";

@Entity({name: TableName.MOON})
export class CalendarMoon {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({name: "created_date"})
    createdDate: Date;

    @UpdateDateColumn({name: "updated_date"})
    updatedDate: Date;

    @Column()
    name: string;

    @Column({nullable: true})
    description: string;

    @Column()
    cycle: number;

    @Column()
    shift: number;

    @OneToMany(type => CalendarMoonPhase, phase => phase.moon, {
        onDelete: "SET NULL",
        nullable: true,
        eager: true
    })
    phases?: CalendarMoonPhase[];

    @ManyToOne(type => Calendar, calendar => calendar.moons,{
        cascade: true
    })
    @JoinColumn({name: "calendar_id"})
    calendar: Calendar;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.name = StringUtility.escapeSQLInput(this.name);
        this.description = StringUtility.escapeSQLInput(this.description);
    }
}