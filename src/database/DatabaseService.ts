import {inject, injectable} from "inversify";
import {Client} from 'pg';
import {TYPES} from "../types";
import {PingFinder} from "../services/ping-finder";

@injectable()
export class DatabaseService {
    /** The URL of the database. */
    private databaseUrl: string;

    constructor(@inject(TYPES.DatabaseUrl) databaseUrl: string) {
        this.databaseUrl = databaseUrl;
    }

    async query (query: string): Promise<JSON> {
        const client = new Client();

        client.connect();

        return client.query(query).then(() => {
            // Close connection.
            client.end();
        });
    }
}