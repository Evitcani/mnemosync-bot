import {Message} from "discord.js";
import {PingFinder} from "./ping-finder";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {PartyService} from "../database/PartyService";
import {PartyFund} from "../database/models/PartyFund";

@injectable()
export class MessageResponder {
    private pingFinder: PingFinder;
    private partyService: PartyService;

    constructor(@inject(TYPES.PingFinder) pingFinder: PingFinder,
                @inject(TYPES.PartyService) partyService: PartyService) {
        this.pingFinder = pingFinder;
        this.partyService = partyService;
    }

    async getBankFunds(message: Message): Promise<Message | Message[]> {
        return this.partyService.getParty("The Seven Wonders").then((res) => {
            return this.partyService.getFund(res.id, "BANK").then((fund) => {
                return message.channel.send(this.formatFundStatement(fund, fund.type));
            }).catch((err: Error) => {
                console.log("Failed to find party fund with given information ::: " + err.message);
                return null;
            });
        }).catch((err: Error) => {
            console.log("Failed to find party with given name ::: " + err.message);
            return null;
        });
    }

    handle(message: Message): Promise<Message | Message[]> {
        if (this.pingFinder.isPing(message.content)) {
            return this.partyService.getParty("The Seven Wonders").then((res) => {
                return message.channel.send('Pong right back at ya, ' + res.name + "!");
            });
        }

        return Promise.reject();
    }

    private formatFundStatement (fund: PartyFund, type: string | null): string {
        if (type !== null) {
            type = type.toLowerCase();
            type += " ";
        }

        let foundMoney = false;
        let amt = 0;

        if (fund.platinum !== null && fund.platinum > 0) {
            amt += (fund.platinum * 10);
            foundMoney = true;
        }

        if (fund.gold !== null && fund.gold > 0) {
            amt += fund.gold;
            foundMoney = true;
        }

        if (fund.silver !== null && fund.silver > 0) {
            amt += (fund.silver / 10);
            foundMoney = true;
        }

        if (fund.copper !== null && fund.copper > 0) {
            amt += (fund.copper / 100);
            foundMoney = true;
        }

        if (!foundMoney) {
            return "There is no money in this " + type + "fund!";
        }

        return "The following amount is currently in the bank fund: " + amt + " gp";
    }
}