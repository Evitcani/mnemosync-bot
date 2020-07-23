"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageUtility = void 0;
const discord_js_1 = require("discord.js");
const Subcommands_1 = require("../documentation/commands/Subcommands");
const StringUtility_1 = require("./StringUtility");
class MessageUtility {
    static sendPrivateMessages(discordIds, message, completionMessage, messageToSend) {
        return __awaiter(this, void 0, void 0, function* () {
            // No one to notify.
            if (!discordIds || discordIds.length < 1) {
                return message.channel.send("Couldn't figure out who to notify.");
            }
            let discordId, i;
            for (i = 0; i < discordIds.length; i++) {
                discordId = discordIds[i];
                this.sendPrivateMessage(discordId, message, messageToSend);
            }
            return message.channel.send(completionMessage);
        });
    }
    /**
     * Does the DM.
     *
     * @param discordId
     * @param message The message to send.
     * @param messageToSend
     */
    static sendPrivateMessage(discordId, message, messageToSend) {
        return __awaiter(this, void 0, void 0, function* () {
            let member;
            if (message.client.users.cache == null || !message.client.users.cache.has(discordId)) {
                member = yield message.client.users.fetch(discordId);
            }
            else {
                member = message.client.users.cache.get(discordId);
            }
            // No member found, so can't send message.
            if (!member) {
                return null;
            }
            // Set the cache.
            if (message.client.users.cache == null) {
                message.client.users.cache = new discord_js_1.Collection();
            }
            message.client.users.cache.set(member.id, member);
            // Send the message.
            return member.send(messageToSend);
        });
    }
    /**
     * Gets the page based on next or previous.
     *
     * @param command The commands to search for commands from.
     */
    static getPage(command) {
        let page = 0;
        if (Subcommands_1.Subcommands.NEXT.isCommand(command)) {
            const nextCmd = Subcommands_1.Subcommands.NEXT.getCommand(command);
            page = StringUtility_1.StringUtility.getNumber(nextCmd.getInput());
            if (page == null) {
                if (nextCmd.getInput() == null) {
                    page = 1;
                }
                else {
                    page = 0;
                }
            }
        }
        return page;
    }
}
exports.MessageUtility = MessageUtility;
//# sourceMappingURL=MessageUtility.js.map