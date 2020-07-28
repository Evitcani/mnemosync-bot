import {Column, JoinColumn, ManyToOne, OneToOne} from "typeorm";
import {Calendar} from "./Calendar";

export class GameDate {
    @Column({nullable: true})
    day: number;

    @Column({nullable: true})
    month: number;

    @Column({nullable: true})
    year: number;

    @Column({nullable: true})
    eraId?: string;

    @Column({nullable: true})
    calendarId?: string;

    @OneToOne(type => Calendar, {
        nullable: true
    })
    @JoinColumn()
    calendar?: Calendar;
}