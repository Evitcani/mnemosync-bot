import {inject, injectable} from "inversify";
import {DatabaseService} from "./base/DatabaseService";
import {TYPES} from "../types";
import {Party} from "../models/database/Party";
import {StringUtility} from "../utilities/StringUtility";
import {DatabaseHelperService} from "./base/DatabaseHelperService";
import {Table} from "../documentation/databases/Table";
import {DbColumn} from "../models/database/schema/columns/DbColumn";
import {Column} from "../documentation/databases/Column";
import {DatabaseDivider} from "../enums/DatabaseDivider";

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
        // Sanitize inputs.
        const sanitizedGuildId = StringUtility.escapeMySQLInput(guildId);

        const query = `SELECT t1.id, t2.name FROM ${Table.PARTY_TO_GUILD} t1 INNER JOIN ${Table.PARTY} t2 ON t1.party_id = t2.id WHERE t1.guild_id = ${sanitizedGuildId}`;

        // Construct query.
        return this.databaseService.query(query).then((res) => {
            if (res.rowCount <= 0) {
                return null;
            }

            // @ts-ignore
            const result: Party[] = res.rows;

            return result;
        }).catch((err: Error) => {
            console.log("QUERY USED: " + query);
            console.log("ERROR: Could not get parties for the given guild. ::: " + err.message);
            console.log(err.stack);
            return null;
        });
    }

    /**
     * Gets the party with the given name.
     *
     * @param name
     */
    async getParty (name: string): Promise<Party>{
        const whereColumns = [new DbColumn(Column.NAME, name).setSanitized(true).setDivider(DatabaseDivider.LIKE)];
        const query = DatabaseHelperService.doSelectQuery(Table.PARTY, whereColumns);

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