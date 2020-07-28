import {Message, MessageEmbed} from "discord.js";
import {BasicEmbed} from "../../BasicEmbed";
import {Calendar} from "../../../entity/Calendar";
import {GameDate} from "../../../entity/GameDate";
import {World} from "../../../entity/World";
import {Party} from "../../../entity/Party";
import {CurrentDate} from "../../../entity/CurrentDate";
import {MessageUtility} from "../../../utilities/MessageUtility";
import {CalendarController} from "../../../controllers/world/calendar/CalendarController";

export class CalendarRelatedResponses {
    static SELECT_CALENDAR(calendars: Calendar[], action: string): MessageEmbed {
        let worldStr = "";
        let calendar: Calendar, i;
        for (i = 0; i < calendars.length; i++) {
            calendar = calendars[i];
            worldStr += `[\`${i}\`] ${calendar.name}\n`;
        }

        return BasicEmbed.get()
            .setTitle(`Please select which calendar you want to ${action}`)
            .setDescription(`Select from the following calendars by pressing the given number:\n` +
                worldStr);
    }

    static async PRINT_DATE(currentDate: CurrentDate, party: Party, message: Message,
                            calendarController: CalendarController): Promise<MessageEmbed> {
        let calendar = await calendarController.get(currentDate.calendarId);
        if (calendar == null) {
            await message.channel.send("Could not get a calendar.");
            return Promise.resolve(null);
        }

        // Now get the date.
        let date = await MessageUtility.getProperDate(currentDate.date, message, calendar, calendarController);
        if  (date == null) {
            return null;
        }

        let embed = BasicEmbed.get()
            .setTitle(`Current date for ${party.name}`)
            .setDescription(`It's the ${date}.`);

        if (calendar.moons.length > 0 && calendar.moons.length <= 22) {
            calendar.moons.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });

            calendar.moons.forEach((value) => {
                embed.addField(value.name, MessageUtility.getMoonPhase(value, currentDate.date.day, calendar.yearLength), true);
            });
        }

        return embed;
    }
}