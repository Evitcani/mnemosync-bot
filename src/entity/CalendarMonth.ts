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

@Entity({name: Table.MONTH})
export class CalendarMonth {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({name: "created_date"})
    createdDate: Date;

    @UpdateDateColumn({name: "updated_date"})
    updatedDate: Date;

    @Column({name: "name"})
    name: string;

    @Column({name: "length"})
    length: number;

    @Column({name: "order"})
    order: number;

    @ManyToOne(type => Calendar, calendar => calendar.months,{
        cascade: true
    })
    @JoinColumn({name: "calendar_id"})
    calendar: Calendar;


}