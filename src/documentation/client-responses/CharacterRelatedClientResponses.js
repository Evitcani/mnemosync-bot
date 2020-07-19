"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterRelatedClientResponses = void 0;
const BasicEmbed_1 = require("../BasicEmbed");
const bot_1 = require("../../bot");
const Commands_1 = require("../commands/Commands");
const Subcommands_1 = require("../commands/Subcommands");
class CharacterRelatedClientResponses {
    static NOW_PLAYING_AS_CHARACTER(character, newlyCreated) {
        const embed = BasicEmbed_1.BasicEmbed.get();
        embed.setTitle(`You are now playing as ${character.name}`);
        if (character.img_url != null) {
            embed.setThumbnail(character.img_url);
        }
        embed.setDescription(`You are now playing as ${newlyCreated ? "newly created character " : ""}${character.name}. ` +
            `To switch characters, type \`${bot_1.Bot.PREFIX}${Commands_1.Commands.CHARACTER} ${bot_1.Bot.PREFIX_SUBCOMMAND}${Subcommands_1.Subcommands.SWITCH} ` +
            `[character name]\`. To view all of your characters, type ` +
            `\`${bot_1.Bot.PREFIX}${Commands_1.Commands.WHICH} ${Commands_1.Commands.CHARACTER}\`.`);
        return embed;
    }
}
exports.CharacterRelatedClientResponses = CharacterRelatedClientResponses;
//# sourceMappingURL=CharacterRelatedClientResponses.js.map