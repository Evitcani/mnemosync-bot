import {Message} from "discord.js";
import {PingFinder} from "./ping-finder";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {PartyService} from "../database/PartyService";

@injectable()
export class MessageResponder {
    private pingFinder: PingFinder;
    private partyService: PartyService;

    constructor(@inject(TYPES.PingFinder) pingFinder: PingFinder,
                @inject(TYPES.PartyService) partyService: PartyService) {
        this.pingFinder = pingFinder;
        this.partyService = partyService;
    }

    handle(message: Message): Promise<Message | Message[]> {
        if (this.pingFinder.isPing(message.content)) {
            this.partyService.getParty("The Seven Wonders").then((res) => {

                return message.channel.send('Pong right back at ya, ' + res.name + "!");
            });
        }

        return Promise.reject();
    }
}