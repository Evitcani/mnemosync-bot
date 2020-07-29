import {MessageEmbed} from "discord.js";
import {BasicEmbed} from "../../BasicEmbed";
import {Party} from "../../../../entity/Party";

export class PartyRelatedClientResponses {
    static SELECT_PARTY(parties: Party[], action: string): MessageEmbed {
        let worldStr = "";
        let party: Party, i;
        for (i = 0; i < parties.length; i++) {
            party = parties[i];
            worldStr += `[\`${i}\`] ${party.name}\n`;
        }

        return BasicEmbed.get()
            .setTitle(`Please select which party you want to ${action}`)
            .setDescription(`Select from the following parties by pressing the given number:\n` +
                worldStr);
    }
}