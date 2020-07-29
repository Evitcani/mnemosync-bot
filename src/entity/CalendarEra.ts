import {
    BeforeInsert, BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Calendar} from "./Calendar";
import {GameDate} from "./GameDate";
import {Table} from "../shared/documentation/databases/Table";
import {StringUtility} from "../backend/utilities/StringUtility";

@Entity({name: Table.ERA})
export class CalendarEra {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({name: "created_date"})
    createdDate: Date;

    @UpdateDateColumn({name: "updated_date"})
    updatedDate: Date;

    @Column({name: "name"})
    name: string;

    @Column()
    order: number;

    @Column( type => GameDate)
    start: GameDate;

    @Column( type => GameDate)
    end?: GameDate;

    @ManyToOne(type => Calendar, calendar => calendar.eras,{
        cascade: true
    })
    @JoinColumn({name: "calendar_id"})
    calendar: Calendar;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.name = StringUtility.escapeSQLInput(this.name);
    }
}