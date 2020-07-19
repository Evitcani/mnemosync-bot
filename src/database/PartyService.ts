import {inject, injectable} from "inversify";
import {DatabaseService} from "./base/DatabaseService";
import {TYPES} from "../types";
import {Party} from "../models/database/Party";
import {DatabaseHelperService} from "./base/DatabaseHelperService";
import {Table} from "../documentation/databases/Table";
import {DbColumn} from "../models/database/schema/columns/DbColumn";
import {Column} from "../documentation/databases/Column";
import {DatabaseDivider} from "../enums/DatabaseDivider";
import {DbTable} from "../models/database/schema/DbTable";

/**
 * The party service manager.
 */
@injectable()
export class PartyService {
    /** Underlying database service. */
    private databaseService: DatabaseService;

    /**
     * Constructs a new party service.
     *
     * @param databaseService The service to connect to the database.
     */
    constructor(@inject(TYPES.DatabaseService) databaseService: DatabaseService) {
        this.databaseService = databaseService;
    }

    public async getPartiesInGuild (guildId: string): Promise<Party[]> {
        // Get the first table.
        const t1 = new DbTable(Table.PARTY_TO_GUILD).setDesignation(1)
            .addWhereColumns(new DbColumn(Column.GUILD_ID, guildId).setSanitized(true));

        // Get the second table.
        const t2 = new DbTable(Table.PARTY).setDesignation(2)
            .addSelectColumns(new DbColumn(Column.ID, null))
            .addSelectColumns(new DbColumn(Column.NAME, null));

        // Query.
        const query = DatabaseHelperService.do2JoinSelectQuery(t1, t2, new DbColumn(Column.PARTY_ID, Column.ID));

        // Construct query.
        return this.getParties(query);
    }

    public async getPartiesInGuildWithName(guildId: string, partyName: string): Promise<Party[]> {
        // Get the first table.
        const t1 = new DbTable(Table.PARTY_TO_GUILD).setDesignation(1)
            .addWhereColumns(new DbColumn(Column.GUILD_ID, guildId).setSanitized(true));

        // Get the second table.
        const t2 = new DbTable(Table.PARTY).setDesignation(2)
            .addWhereColumns(new DbColumn(Column.NAME, partyName).setSanitized(true).setDivider(DatabaseDivider.LIKE))
            .addSelectColumns(new DbColumn(Column.ID, null))
            .addSelectColumns(new DbColumn(Column.NAME, null));

        // Query.
        const query = DatabaseHelperService.do2JoinSelectQuery(t1, t2, new DbColumn(Column.PARTY_ID, Column.ID));

        // Do the query.
        return this.getParties(query);
    }

    /**
     * Gets the parties with the given query.
     * @param query
     */
    private async getParties(query: string): Promise<Party[]> {
        return this.databaseService.query(query).then((res) => {
            console.debug("QUERY USED: " + query);
            console.debug(res);
            if (res.rowCount <= 0) {
                return null;
            }

            // @ts-ignore
            const result: Party[] = res.rows;

            return result;
        }).catch((err: Error) => {
            console.error("QUERY USED: " + query);
            console.error("ERROR: Could not get parties for the given guild. ::: " + err.message);
            console.error(err.stack);
            return null;
        });
    }

    /**
     * Gets the party with the given name.
     *
     * @param name
     */
    async getParty (name: string): Promise<Party>{
        const table = new DbTable(Table.PARTY)
            .addWhereColumns(new DbColumn(Column.NAME, name).setSanitized(true).setDivider(DatabaseDivider.LIKE));
        const query = DatabaseHelperService.doSelectQuery(table);

        // Construct query.
        return this.databaseService.query(query).then((res) => {
            if (res.rowCount <= 0) {
                return null;
            }

            // @ts-ignore
            const result: Party = res.rows[0];

            return result;
        }).catch((err: Error) => {
            console.log("ERROR: COULD NOT GET PARTY ::: " + err.message);
            console.log(err.stack);
            return null;
        });
    }
}