import {MessageEmbed} from "discord.js";

export class BasicEmbed {
    /**
     * Gets the basic embed with some fields.
     */
    public static get() : MessageEmbed {
        return new MessageEmbed()
            .setColor('#0099ff')
            .setFooter('Created by @Evit_cani on Twitter.')
            .setTimestamp();
    }
}