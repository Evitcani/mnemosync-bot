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
                console.log(JSON.stringify(res));

                const result: Party = res[0];

                return result;
            }).catch((err: Error) => {
                console.log("ERROR: COULD NOT GET PARTY ::: " + err.message);
            });
        });
    }
}