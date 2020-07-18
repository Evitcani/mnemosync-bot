import {DatabaseService} from "./base/DatabaseService";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {PartyFund} from "../models/database/PartyFund";
import {DatabaseHelperService} from "./base/DatabaseHelperService";
import {Table} from "../documentation/databases/Table";
import {Column} from "../documentation/databases/Column";
import {DbColumn} from "../models/database/schema/columns/DbColumn";

/**
 * Service for managing calls to the database related to party funds.
 */
@injectable()
export class PartyFundService {
    /** Connection to the database object. */
    private databaseService: DatabaseService;

    constructor(@inject(TYPES.DatabaseService) databaseService: DatabaseService) {
        this.databaseService = databaseService;
    }

    async updateFunds (id: number, platinum: number | null, gold: number | null, silver: number | null,
                       copper: number | null): Promise<PartyFund>{
        const setColumns: DbColumn[] = [];

        // Check all the gold amounts, only update what changed.
        if (platinum !== null) {
            setColumns.push(new DbColumn(Column.PLATINUM, platinum));
        }

        if (gold !== null) {
            setColumns.push(new DbColumn(Column.GOLD, gold));
        }

        if (silver !== null) {
            setColumns.push(new DbColumn(Column.SILVER, silver));
        }

        if (copper !== null) {
            setColumns.push(new DbColumn(Column.COPPER, copper));
        }

        const query = DatabaseHelperService.doUpdateQuery(Table.PARTY_FUND, setColumns, [new DbColumn(Column.ID, id)]);

        console.log("Updating party funds with query: " + query);

        return this.databaseService.query(query).then(() => {
            return this.getFundById(id);
        }).catch((err: Error) => {
            console.log("ERROR: Could not update the party funds! ::: " + err.message);
            console.log(err.stack);
            return null;
        });
    }

    async getFundById (id: number): Promise<PartyFund>{
        const query = DatabaseHelperService.doSelectQuery(Table.PARTY_FUND, [new DbColumn(Column.ID, id)]);
        return this.doGetFund(query);
    }

    async getFund (partyID: number, type: string): Promise<PartyFund>{
        // columns
        const columns = [new DbColumn(Column.TYPE, type).setSanitized(true), new DbColumn(Column.PARTY_ID, partyID)];

        // Construct query.
        const query = DatabaseHelperService.doSelectQuery(Table.PARTY_FUND, columns);
        return this.doGetFund(query);
    }

    private async doGetFund (query: string) : Promise<PartyFund> {
        return this.databaseService.query(query).then((res) => {
            if (res.rowCount <= 0) {
                return null;
            }

            // @ts-ignore
            const result: PartyFund = res.rows[0];

            return result;
        }).catch((err: Error) => {
            console.log("ERROR: Could not get party funds! ::: " + err.message + " ::: QUERY: " + query);
            console.log(err.stack);
            return null;
        });
    }
}