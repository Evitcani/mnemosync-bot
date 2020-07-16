import {inject, injectable} from "inversify";
import {DatabaseService} from "./DatabaseService";
import {TYPES} from "../types";

@injectable()
export class PartyService {
    private databaseService: DatabaseService;

    constructor(@inject(TYPES.DatabaseService) databaseService: DatabaseService) {
        this.databaseService = databaseService;
    }

    async getParty (name: string): Promise<Party>{
        return new Promise<Party>((resolve, reject) => {
            this.databaseService.query("SELECT * FROM parties").then((res) => {
                const result = res[0];
                console.log(JSON.stringify(result));
            });
        });
    }
}