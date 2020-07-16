import {inject, injectable} from "inversify";
import {Client} from 'pg';
import {TYPES} from "../types";
import {DatabaseReturn} from "./models/DatabaseReturn";

@injectable()
export class DatabaseService {
    /** The URL of the database. */
    private readonly databaseUrl: string;

    constructor(@inject(TYPES.DatabaseUrl) databaseUrl: string) {
        this.databaseUrl = databaseUrl;
    }

    async query (query: string): Promise<DatabaseReturn> {
        const client = new Client({
            connectionString: this.databaseUrl,
            ssl: {
                rejectUnauthorized: false
            }
        });

        client.connect();

        return client.query(query).then((res: DatabaseReturn) => {
            // Close connection.
            client.end();

            return res;
        });
    }
}