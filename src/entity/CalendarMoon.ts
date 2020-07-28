import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Calendar} from "./Calendar";
import {Table} from "../documentation/databases/Table";

@Entity({name: Table.MOON})
export class CalendarMoon {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({name: "created_date"})
    createdDate: Date;

    @UpdateDateColumn({name: "updated_date"})
    updatedDate: Date;

    @Column()
    name: string;

    @Column()
    cycle: number;

    @Column()
    shift: number;

    @ManyToOne(type => Calendar, calendar => calendar.moons,{
        cascade: true
    })
    @JoinColumn({name: "calendar_id"})
    calendar: Calendar;
}