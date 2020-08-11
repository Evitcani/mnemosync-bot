import {BaseCommandDocumentation} from "./BaseCommandDocumentation";
import {Commands} from "../../Commands";
import {MessageEmbed} from "discord.js";
import {BasicEmbed} from "../../../BasicEmbed";
import {CommandStrut} from "../../CommandStrut";
import {Bot} from "../../../../../bot/bot";

export class QuoteCommandDocumentation extends BaseCommandDocumentation {
    getBasicDescription(): string {
        return `Used to get a random quote from a quote channel.`;
    }

    getCommand(): string {
        return Commands.QUOTE;
    }

    getFullDescription(): MessageEmbed {
        return BasicEmbed.get()
            .setTitle(`Quote Command`)
            .setDescription(`${this.getBasicDescription()} To get a random quote after setting up quotes channel, ` +
                `type, \`${Bot.PREFIX}${this.getCommand()}\`, which will retrieve a quote.\n\n` +
                `**Setting Up a Quote Channel**\n` +
                `To set up a quote channel, go into the channel you want to quote and type:` +
                `\`\`\`${Bot.PREFIX}${this.getCommand()} here\`\`\`` +
                `The quotes will now populate from this channel. You can delete the command and bot responses from ` +
                `the channel.`);
    }

    getSubcommands(): Map<CommandStrut, string> {
        return null;
    }
}