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

@Entity({name: Table.WEEK_DAY})
export class CalendarWeekDay {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({name: "created_date"})
    createdDate: Date;

    @UpdateDateColumn({name: "updated_date"})
    updatedDate: Date;

    @Column()
    name: string;

    @Column()
    order: number;

    @ManyToOne(type => Calendar, calendar => calendar.week,{
        cascade: true
    })
    @JoinColumn({name: "calendar_id"})
    calendar: Calendar;
}