import {DatabaseService} from "./DatabaseService";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";

@injectable()
export class UserToGuildService {
    private static TABLE_NAME = "user_to_guild";

    /** Connection to the database object. */
    private databaseService: DatabaseService;

    constructor(@inject(TYPES.DatabaseService) databaseService: DatabaseService) {
        this.databaseService = databaseService;
    }
}