import {BaseCommandDocumentation} from "./BaseCommandDocumentation";
import {Commands} from "../../Commands";
import {MessageEmbed} from "discord.js";
import {BasicEmbed} from "../../../BasicEmbed";
import {CommandStrut} from "../../CommandStrut";
import {Subcommands} from "../../Subcommands";

export class HelpCommandDocumentation extends BaseCommandDocumentation {
    getBasicDescription(): string {
        return "";
    }

    getCommand(): string {
        return Commands.HELP;
    }

    getFullDescription(): MessageEmbed {
        return BasicEmbed.get()
            .setTitle(` Command`);
    }

    getSubcommands(): Map<CommandStrut, string> {
        let map = new Map<CommandStrut, string>();
        map.set(Subcommands.CREATE, ``);
        return map;
    }
}