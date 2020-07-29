"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendingCommandDocumentation = void 0;
const BaseCommandDocumentation_1 = require("./BaseCommandDocumentation");
const Commands_1 = require("../../Commands");
const BasicEmbed_1 = require("../../../BasicEmbed");
const Subcommands_1 = require("../../Subcommands");
const bot_1 = require("../../../../bot");
class SendingCommandDocumentation extends BaseCommandDocumentation_1.BaseCommandDocumentation {
    getBasicDescription() {
        return `Used to send secret, magical messages to NPCs and PCs.`;
    }
    getCommand() {
        return Commands_1.Commands.SENDING;
    }
    getFullDescription() {
        return BasicEmbed_1.BasicEmbed.get()
            .setTitle(`Sending Command`)
            .setDescription(`${this.getBasicDescription()} To see unreplied messages, type ` +
            `\`${bot_1.Bot.PREFIX}${this.getCommand()}\`. This will display a queue from oldest to newest messages. ` +
            `Once replied, the message disappears from this list but remains in archive.\n\n` +
            `**Subcommands**\n` +
            `${this.formatSubcommands()}`);
    }
    getSubcommands() {
        let map = new Map();
        map.set(Subcommands_1.Subcommands.TO, `Sends a message to a player character in the world.`);
        map.set(Subcommands_1.Subcommands.TO_NPC, `Sends a message to an NPC in the world.`);
        map.set(Subcommands_1.Subcommands.FROM, `Sends a message from an NPC.`);
        map.set(Subcommands_1.Subcommands.MESSAGE, `The contents of the message to send.`);
        map.set(Subcommands_1.Subcommands.DATE, `The **in-game** date the message was sent.`);
        map.set(Subcommands_1.Subcommands.REPLY, `The ID of a message from \`${bot_1.Bot.PREFIX}${this.getCommand()}\` to reply to.`);
        return map;
    }
}
exports.SendingCommandDocumentation = SendingCommandDocumentation;
//# sourceMappingURL=SendingCommandDocumentation.js.map