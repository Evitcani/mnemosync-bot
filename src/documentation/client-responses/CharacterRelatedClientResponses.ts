import {MessageEmbed} from "discord.js";
import {Character} from "../../entity/Character";
import {BasicEmbed} from "../BasicEmbed";
import {Bot} from "../../bot";
import {Commands} from "../commands/Commands";
import {Subcommands} from "../commands/Subcommands";

export class CharacterRelatedClientResponses {
    static NOW_PLAYING_AS_CHARACTER(character: Character, newlyCreated: boolean): MessageEmbed {
        const embed = BasicEmbed.get();
        embed.setTitle(`You are now playing as ${character.name}`);
        if (character.img_url != null) {
            embed.setThumbnail(character.img_url);
        }

        embed.setDescription(`You are now playing as ${newlyCreated ? "newly created character " : ""}${character.name}. ` +
            `To switch characters, type \`${Bot.PREFIX}${Commands.CHARACTER} ${Bot.PREFIX_SUBCOMMAND}${Subcommands.SWITCH.name} ` +
            `[character name]\`. To view all of your characters, type ` +
            `\`${Bot.PREFIX}${Commands.WHICH} ${Commands.CHARACTER}\`.`);

        return embed;
    }
}