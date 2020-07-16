import {inject, injectable} from "inversify";
import {DatabaseService} from "./DatabaseService";
import {TYPES} from "../types";
import {Party} from "./models/Party";
import {PartyFund} from "./models/PartyFund";
import {DatabaseReturn} from "./models/DatabaseReturn";

@injectable()
export class PartyService {
    private databaseService: DatabaseService;

    constructor(@inject(TYPES.DatabaseService) databaseService: DatabaseService) {
        this.databaseService = databaseService;
    }

    async updateFunds (id: number, platinum: number | null, gold: number | null, silver: number | null,
                           copper: number | null): Promise<PartyFund>{
        let query = "UPDATE party_funds SET ";
        let prev = false;

        // Check all the gold amounts, only update what changed.
        if (platinum !== null) {
            query += "platinum = " + platinum;
            prev = true;
        }

        if (gold !== null) {
            if (prev) {
                query += ", ";
            }
            query += "gold = " + gold;
            prev = true;
        }

        if (silver !== null) {
            if (prev) {
                query += ", ";
            }
            query += "silver = " + silver;
            prev = true;
        }

        if (copper !== null) {
            if (prev) {
                query += ", ";
            }
            query += "copper = " + copper;
        }

        query += " WHERE id = " + id;

        console.log("Updating party funds with query: " + query);

        return this.databaseService.query(query).then((res) => {
            return this.getFundById(id);
        }).catch((err: Error) => {
            console.log("ERROR: Could not update the party funds! ::: " + err.message);
            console.log(err.stack);
            return null;
        });
    }

    async getFundById (id: number): Promise<PartyFund>{
        const query = "SELECT * FROM party_funds WHERE id = " + id;
        return this.doGetFund(query);
    }

    async getFund (partyID: number, type: string): Promise<PartyFund>{
        const query = "SELECT * FROM party_funds WHERE type = '" + type + "' AND party_id = " + partyID;
        return this.doGetFund(query);
    }

    private async doGetFund (query: string) : Promise<PartyFund> {
        return this.databaseService.query(query).then((res) => {
            // @ts-ignore
            const result: PartyFund = res.rows[0];

            return result;
        }).catch((err: Error) => {
            console.log("ERROR: Could not get party funds! ::: " + err.message + " ::: QUERY: " + query);
            console.log(err.stack);
            return null;
        });
    }

    async getParty (name: string): Promise<Party>{
        return this.databaseService.query("SELECT * FROM parties").then((res) => {
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