import {MessageEmbed} from "discord.js";
import {BasicEmbed} from "../../BasicEmbed";
import {Calendar} from "../../../entity/Calendar";

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


}