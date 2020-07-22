import {Column} from "typeorm";

export class GameDate {
    @Column()
    day: number;

    @Column()
    month: number;

    @Column()
    year: number;

    @Column({nullable: true})
    era?: string;
}