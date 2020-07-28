import {Column} from "typeorm";

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
}