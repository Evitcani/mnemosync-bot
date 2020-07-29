import {BaseCommandDocumentation} from "./BaseCommandDocumentation";
import {Commands} from "../../Commands";
import {MessageEmbed} from "discord.js";
import {BasicEmbed} from "../../../BasicEmbed";
import {CommandStrut} from "../../CommandStrut";
import {Subcommands} from "../../Subcommands";
import {Bot} from "../../../../bot";

export class SendingCommandDocumentation extends BaseCommandDocumentation {
    getBasicDescription(): string {
        return `Used to send secret, magical messages to NPCs and PCs.`;
    }

    getCommand(): string {
        return Commands.SENDING;
    }

    getFullDescription(): MessageEmbed {
        return BasicEmbed.get()
            .setTitle(`Sending Command`)
            .setDescription(`${this.getBasicDescription()} To see unreplied messages, type ` +
                `\`${Bot.PREFIX}${this.getCommand()}\`. This will display a queue from oldest to newest messages. ` +
                `Once replied, the message disappears from this list but remains in archive.\n\n` +
                `**Subcommands**\n` +
                `${this.formatSubcommands()}`)
    }

    getSubcommands(): Map<CommandStrut, string> {
        let map = new Map<CommandStrut, string>();
        map.set(Subcommands.TO, `Sends a message to a player character in the world.`);
        map.set(Subcommands.TO_NPC, `Sends a message to an NPC in the world.`);
        map.set(Subcommands.FROM, `Sends a message from an NPC.`);
        map.set(Subcommands.MESSAGE, `The contents of the message to send.`);
        map.set(Subcommands.DATE, `The **in-game** date the message was sent.`);
        map.set(Subcommands.REPLY, `The ID of a message from \`${Bot.PREFIX}${this.getCommand()}\` to reply to.`);
        return map;
    }
}