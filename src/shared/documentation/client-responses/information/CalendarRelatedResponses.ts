import {Message, MessageEmbed} from "discord.js";
import {BasicEmbed} from "../../BasicEmbed";
import {Calendar} from "../../../../backend/entity/calendar/Calendar";
import {Party} from "../../../../backend/entity/Party";
import {CurrentDate} from "../../../../backend/entity/CurrentDate";
import {MessageUtility} from "../../../../backend/utilities/MessageUtility";
import {CalendarController} from "../../../../backend/controllers/world/CalendarController";
import {messageResponse} from "../../messages/MessageResponse";
import {messageTypes} from "../../messages/MessageTypes";
import {messageEmbed} from "../../messages/MessageEmbed";

export class CalendarRelatedResponses {
    static SELECT_CALENDAR(calendars: Calendar[], action: string): MessageEmbed {
        return messageEmbed.generic.select_from_the_following(messageTypes.calendar, action, calendars);
    }

    static async PRINT_DATE(currentDate: CurrentDate, party: Party, message: Message,
                            calendarController: CalendarController): Promise<MessageEmbed> {
        let calendar = await calendarController.get(currentDate.calendarId);
        if (calendar == null) {
            await message.channel.send(messageResponse.generic.could_not_get.msg(messageTypes.calendar.singular));
            return Promise.resolve(null);
        }

        // Now get the date.
        let date = await MessageUtility.getProperDate(currentDate.date, message, calendar, calendarController);
        if  (date == null) {
            return null;
        }

        let embed = BasicEmbed.get()
            .setTitle(messageResponse.date.get.title(party.name))
            .setDescription(messageResponse.date.get.desc(date));

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