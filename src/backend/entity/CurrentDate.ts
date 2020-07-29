import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {GameDate} from "./GameDate";
import {Party} from "./Party";
import {Calendar} from "./calendar/Calendar";
import {TableName} from "../../shared/documentation/databases/TableName";

@Entity({name: TableName.CURRENT_DATE})
export class CurrentDate {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({name: "created_date"})
    createdDate: Date;

    @UpdateDateColumn({name: "updated_date"})
    updatedDate: Date;

    @Column( type => GameDate)
    date: GameDate;

    @Column({name: "calendar_id", nullable: true})
    calendarId?: string;

    @ManyToOne(type => Calendar, {
        onDelete: "SET NULL",
        eager: true,
        nullable: true
    })
    @JoinColumn({name: "calendar_id"})
    calendar?: Calendar;

    @OneToOne(type => Party, party => party.currentDate, {
        cascade: true
    })
    party: Party;
}