import {Collection, User as DiscordUser, Message, MessageEmbed, Snowflake} from "discord.js";
import {Subcommands} from "../documentation/commands/Subcommands";
import {StringUtility} from "./StringUtility";
import {Command} from "../models/generic/Command";
import {GameDate} from "../entity/GameDate";
import {CurrentDate} from "../entity/CurrentDate";
import {CalendarController} from "../controllers/world/calendar/CalendarController";
import {CalendarMonth} from "../entity/CalendarMonth";

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

    public static async processDateCommand(command: Command, message: Message): Promise<GameDate> {
        const dateCmd = Subcommands.DATE.getCommand(command);
        let input = dateCmd.getInput();
        if (input == null) {
            await message.channel.send("There was no actual date given.");
            return Promise.resolve(null);
        }
        // Split the date and process.
        let dates = input.split("/");
        if (dates.length < 3) {
            await message.channel.send("Date was malformed. Should be like `[day]/[month]/[year]`");
            return Promise.resolve(null);
        }

        // TODO: Implement era processing.
        let day = StringUtility.getNumber(dates[0]),
            month = StringUtility.getNumber(dates[1]),
            year = StringUtility.getNumber(dates[2]);

        // TODO: Better response here.
        if (day == null || month == null || year == null) {
            await message.channel.send("Date was malformed. Day, month or year was not a number. Should be like " +
                "`[# day]/[# month]/[# year]`");
            return Promise.resolve(null);
        }

        // Now put it inside the sending.
        let inGameDate = new GameDate();
        inGameDate.day = day;
        inGameDate.month = month;
        inGameDate.year = year;

        return Promise.resolve(inGameDate)
    }

    public static async getProperDate(date: GameDate, message: Message, calendarController: CalendarController): Promise<string> {
        let calendar = await calendarController.get(date.calendarId);
        if (calendar == null) {
            await message.channel.send("Could not get a calendar.");
            return Promise.resolve(null);
        }

        date.calendarId = calendar.id;

        let day = date.day;
        let month = date.month;
        let year = date.year;

        return `${day}${this.nthOfNumber(day)} of ${this.getMonthName(month, calendar.months)}, ${year} `;
    }

    public static getMonthName(month: number, months: CalendarMonth[]): string {
        if (months == null) {
            return null;
        }

        // Sort months by order.
        months.sort((a, b) => {
            return a.order - b.order;
        });

        // Get the last month if we exceed.
        if (months.length <= month) {
            return months[months.length - 1].name;
        }

        // Return the name.
        return months[month].name;
    }

    public static nthOfNumber(n: number): string {
        if (n > 10 && n < 20) {
            return "th";
        }

        let str = String(n);
        let sub = str.substr(str.length - 1, 1);

        switch (sub) {
            case "1":
                return "st";
            case "2":
                return "nd";
            case "3":
                return "rd";
            default:
                return "th";
        }
    }
}