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

/**
 * day = number of days as time goes on
 PlanetPeriod = number of days in planet's year
 Moon1Period = number of days in moon1 cycle
 Moon2Period = number of days in moon2 cycle

 Col 1: Angle of planet relative to sun = (day MOD PlanetPeriod) * (360/PlanetPeriod)
 Col 2: Angle of moon1 relative to planet = (day MOD Moon1Period) * (360/Moon1Period)
 Col 3: Angle of moon2 relative to planet = (day MOD Moon2Period) * (360/Moon2Period)
 Col 4: Viewing Angle of Moon1 = Col2 minus Col1
 Col 5: Viewing Angle of Moon2 = Col3 minus Col1

 The Viewing Angle will tell you what phase the moon is in. A Viewing Angle of 0 degrees is a full moon. Viewing angle
 of 90 degrees is a first quarter moon. 180 degrees is a new moon. Etc, through 360.
 */

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