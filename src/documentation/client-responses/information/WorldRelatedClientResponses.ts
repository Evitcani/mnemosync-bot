import {MessageEmbed} from "discord.js";
import {World} from "../../../entity/World";
import {BasicEmbed} from "../../BasicEmbed";

export class WorldRelatedClientResponses {
    static SELECT_WORLD(worlds: World[], action: string): MessageEmbed {
        let worldStr = "";
        let world, i;
        for (i = 0; i < worlds.length; i++) {
            world = worlds[i];
            worldStr += `[\`${i}\`] ${world.name}\n`;
        }

        return BasicEmbed.get()
            .setTitle(`Please select which world you want to ${action} to`)
            .setDescription(`Select from the following worlds by pressing the given number:\n` +
                worldStr);
    }
}