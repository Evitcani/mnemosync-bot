import {Collection, User as DiscordUser, Message, MessageEmbed, Snowflake} from "discord.js";
import {Subcommands} from "../documentation/commands/Subcommands";
import {StringUtility} from "./StringUtility";
import {Command} from "../models/generic/Command";

export class MessageUtility {

    public static async sendPrivateMessages(discordIds: string[], message: Message, completionMessage: MessageEmbed, messageToSend: MessageEmbed): Promise<Message | Message[]> {
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
    }

    /**
     * Does the DM.
     *
     * @param discordId
     * @param message The message to send.
     * @param messageToSend
     */
    public static async sendPrivateMessage(discordId: string, message: Message, messageToSend: MessageEmbed): Promise<Message> {
        let member: DiscordUser;

        if (message.client.users.cache == null || !message.client.users.cache.has(discordId)) {
            member = await message.client.users.fetch(discordId);
        } else {
            member = message.client.users.cache.get(discordId);
        }

        // No member found, so can't send message.
        if (!member) {
            return null;
        }

        // Set the cache.
        if (message.client.users.cache == null) {
            message.client.users.cache = new Collection<Snowflake, DiscordUser>();
        }
        message.client.users.cache.set(member.id, member);

        // Send the message.
        return member.send(messageToSend);
    }

    /**
     * Gets the page based on next or previous.
     *
     * @param command The commands to search for commands from.
     */
    public static getPage(command: Command): number {
        let page = 0;
        if (Subcommands.NEXT.isCommand(command)) {
            const nextCmd = Subcommands.NEXT.getCommand(command);
            page = StringUtility.getNumber(nextCmd.getInput());
            if (page == null) {
                if (nextCmd.getInput() == null) {
                    page = 1;
                } else  {
                    page = 0
                }
            }
        }

        return page;
    }
}