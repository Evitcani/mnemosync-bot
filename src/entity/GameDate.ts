import {Column, JoinColumn, ManyToOne, OneToOne} from "typeorm";
import {CalendarEra} from "./CalendarEra";
import {Calendar} from "./Calendar";

export class GameDate {
    @Column({nullable: true})
    day: number;

    @Column({nullable: true})
    month: number;

    @Column({nullable: true})
    year: number;

    @Column({name: "era_id", nullable: true})
    eraId?: string;

    @Column({name: "calendar_id", nullable: true})
    calendarId?: string;

    @OneToOne(type => Calendar, {
        nullable: true
    })
    @JoinColumn({name: "calendar_id"})
    calendar?: Calendar;
}