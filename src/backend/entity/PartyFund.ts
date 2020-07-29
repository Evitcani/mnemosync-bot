import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Party} from "./Party";
import {StringUtility} from "../utilities/StringUtility";
import {TableName} from "../../shared/documentation/databases/TableName";

@Entity({name: TableName.PARTY_FUND})
export class PartyFund {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

    @ManyToOne(type => Party, party => party.funds, {
        cascade: true
    })
    party: Party;

    @Column("text")
    type: string;

    @Column({ nullable: true })
    platinum?: number;

    @Column({ nullable: true })
    gold?: number;

    @Column({ nullable: true })
    silver?: number;

    @Column({ nullable: true })
    copper?: number;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.type = StringUtility.escapeSQLInput(this.type);
    }

    isNegative: boolean = false;
}