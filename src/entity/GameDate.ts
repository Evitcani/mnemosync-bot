import {Column, JoinColumn, ManyToOne, OneToOne} from "typeorm";
import {CalendarEra} from "./CalendarEra";
import {Calendar} from "./Calendar";
import {Character} from "./Character";

export class GameDate {
    @Column({nullable: true})
    day: number;

    @Column({nullable: true})
    month: number;

    @Column({nullable: true})
    year: number;

    @Column({name: "era_id", nullable: true})
    eraId?: string;

    @ManyToOne(type => CalendarEra, {
        onDelete: "SET NULL",
        eager: true,
        nullable: true
    })
    @JoinColumn({name: "era_id"})
    era?: CalendarEra;

    @Column({name: "calendar_id", nullable: true})
    calendarId?: string;

    @OneToOne(type => Character, character => character.travel_config, {
        cascade: true
    })
    @JoinColumn({name: "calendar_id"})
    calendar?: Calendar;
}