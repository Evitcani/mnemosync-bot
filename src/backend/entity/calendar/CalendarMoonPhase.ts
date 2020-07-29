import {
    BeforeInsert, BeforeUpdate,
    Column,
    CreateDateColumn, Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {CalendarMoon} from "./CalendarMoon";
import {StringUtility} from "../../utilities/StringUtility";
import {TableName} from "../../../shared/documentation/databases/TableName";

@Entity({name: TableName.MOON_PHASE})
export class CalendarMoonPhase {
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

    @Column({name: "viewing_angle_start"})
    viewingAngleStart: number;

    @Column({name: "viewing_angle_end"})
    viewingAngleEnd: number;

    @ManyToOne(type => CalendarMoon, moon => moon.phases,{
        cascade: true
    })
    @JoinColumn({name: "calendar_moon_id"})
    moon: CalendarMoon;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.name = StringUtility.escapeSQLInput(this.name);
    }
}