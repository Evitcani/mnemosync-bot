import {MessageEmbed} from "discord.js";
import {Bot} from "../../../bot";
import {CommandStrut} from "../CommandStrut";

export abstract class BaseCommandDocumentation {
    public abstract getCommand(): string;

    public abstract getSubcommands(): Map<CommandStrut, string>;

    public abstract getBasicDescription(): string;

    public abstract getFullDescription(): MessageEmbed;

    public formatCommand(): string {
        return `\`${Bot.PREFIX}${this.getCommand()}\` - ${this.getBasicDescription()}`;
    }

    /**
     * Formats the subcommands for this command into a pretty string for printing.
     */
    public formatSubcommands(): string {
        let str = "";
        let subcommands: Map<CommandStrut, string> = this.getSubcommands();
        if (!subcommands) {
            return "";
        }

        subcommands.forEach((value, key: CommandStrut) => {
            // Add spacing.
            str += `\n\n`;

            // Add the name of the prefix.
            str += `\`${Bot.PREFIX_SUBCOMMAND}${key.name}\``;
            if (key.shortenedName != null) {
                str += ` | \`${Bot.PREFIX_SUBCOMMAND}${key.shortenedName}\``;
            }
            str += ` - ${value}`;
        });

        return str;
    }
}