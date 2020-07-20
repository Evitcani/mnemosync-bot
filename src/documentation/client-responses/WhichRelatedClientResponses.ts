import {MessageEmbed} from "discord.js";
import {Party} from "../../entity/Party";
import {BasicEmbed} from "../BasicEmbed";

export class WhichRelatedClientResponses {
    static LIST_ALL_PARTIES (parties: Party[]): MessageEmbed {
        if (parties == null || parties.length <= 0) {
            return WhichRelatedClientResponses.LIST_NO_PARTY();
        }

        if (parties.length == 1) {
            return WhichRelatedClientResponses.LIST_SINGLE_PARTY(parties[0]);
        }

        let partyStr = "";
        let party;
        for (party in parties) {
            partyStr += "[`*`] " + party.name + "\n";
        }

        return BasicEmbed.get()
            .setTitle("All parties in this server")
            .addField("Parties", "The following parties are registered in this server: \n" + partyStr,
                false);
    }

    static LIST_SINGLE_PARTY (party: Party): MessageEmbed {
        return BasicEmbed.get()
            .setTitle("All parties in this server")
            .addField("Parties", "The only party registered for this server is: " + party.name,
                false);
    }

    static LIST_NO_PARTY (): MessageEmbed {
        return BasicEmbed.get()
            .setTitle("All parties in this server")
            .addField("Parties", "There are no parties in this server.\n\nTo create a new party for " +
                "this server, use the command `$party create --name [Some party name]`.",
                false);
    }
}