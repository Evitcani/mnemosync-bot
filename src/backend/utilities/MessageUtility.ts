import {Collection, Message, MessageEmbed, Snowflake, User as DiscordUser} from "discord.js";
import {Subcommands} from "../../shared/documentation/commands/Subcommands";
import {StringUtility} from "./StringUtility";
import {Command} from "../../shared/models/generic/Command";
import {DateDTO} from "../api/dto/model/DateDTO";
import {CalendarDTO} from "../api/dto/model/calendar/CalendarDTO";
import {CalendarMonthDTO} from "../api/dto/model/calendar/CalendarMonthDTO";
import {DTOType} from "../api/dto/DTOType";
import {CalendarMoonDTO} from "../api/dto/model/calendar/CalendarMoonDTO";

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

    public static async processDateCommand(command: Command, message: Message): Promise<DateDTO> {
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
        let inGameDate: DateDTO = {dtoType: DTOType.DATE};
        inGameDate.day = day;
        inGameDate.month = month;
        inGameDate.year = year;

        return Promise.resolve(inGameDate)
    }

    public static async getProperDate(date: DateDTO, message: Message, calendar: CalendarDTO): Promise<string> {
        if (calendar == null) {
            await message.channel.send("Could not get a calendar.");
            return Promise.resolve(null);
        }

        let day = date.day;
        let month = date.month;
        let year = date.year;

        return `${day}${this.nthOfNumber(day)} of ${this.getMonthName(month, calendar.months)}, ${year} `;
    }

    public static getMonthName(month: number, months: CalendarMonthDTO[]): string {
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

    /**
     * day = number of days as time goes on
     PlanetPeriod = number of days in planet's year
     Moon1Period = number of days in moon1 cycle
     Moon2Period = number of days in moon2 cycle

     Col 1: Angle of planet relative to sun = (day MOD PlanetPeriod) * (360/PlanetPeriod)
     Col 2: Angle of moon1 relative to planet = (day MOD Moon1Period) * (360/Moon1Period)
     Col 3: Angle of moon2 relative to planet = (day MOD Moon2Period) * (360/Moon2Period)
     Col 4: Viewing Angle of Moon1 = Col2 minus Col1
     Col 5: Viewing Angle of Moon2 = Col3 minus Col1

     The Viewing Angle will tell you what phase the moon is in. A Viewing Angle of 0 degrees is a full moon. Viewing angle
     of 90 degrees is a first quarter moon. 180 degrees is a new moon. Etc, through 360.
     */
    public static getMoonPhase(moon: CalendarMoonDTO, day: number, daysInYear: number): string {
        let col1: number = (day % daysInYear) * (360 / daysInYear);
        let col2: number = ((day + moon.shift) % moon.cycle) * (360 / moon.cycle);
        let col3: number = col2 - col1;

        if (moon.phases != null) {
            moon.phases.sort((a, b) => {
                return a.order - b.order;
            });

            moon.phases.forEach((phase) => {
                if (col3 >= phase.viewingAngleStart && col3 < phase.viewingAngleEnd) {
                    return phase.name;
                }
            });
        }

        if (col3 >= 337.5 && col3 < 22.5) {
            return "Full Moon";
        }

        if (col3 >= 22.5 && col3 < 67.5) {
            return "Waxing Gibbous";
        }

        if (col3 >= 67.5 && col3 < 112.5) {
            return "First Quarter";
        }

        if (col3 >= 112.5 && col3 < 157.5) {
            return "Waxing Crescent";
        }

        if (col3 >= 157.5 && col3 < 202.5) {
            return "New Moon";
        }

        if (col3 >= 202.5 && col3 < 247.5) {
            return "Waning Crescent";
        }

        if (col3 >= 247.5 && col3 < 292.5) {
            return "Last Quarter";
        }

        return "Waning Gibbous";
    }
}