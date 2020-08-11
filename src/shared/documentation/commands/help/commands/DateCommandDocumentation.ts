import {BaseCommandDocumentation} from "./BaseCommandDocumentation";
import {Commands} from "../../Commands";
import {MessageEmbed} from "discord.js";
import {BasicEmbed} from "../../../BasicEmbed";
import {CommandStrut} from "../../CommandStrut";
import {Subcommands} from "../../Subcommands";

export class DateCommandDocumentation extends BaseCommandDocumentation {
    getBasicDescription(): string {
        return "";
    }

    getCommand(): string {
        return Commands.DATE;
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