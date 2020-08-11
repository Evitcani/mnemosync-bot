import {Message, MessageEmbed} from "discord.js";
import {BasicEmbed} from "../../BasicEmbed";
import {MessageUtility} from "../../../../backend/utilities/MessageUtility";
import {messageResponse} from "../../messages/MessageResponse";
import {messageTypes} from "../../messages/MessageTypes";
import {CurrentDateDTO} from "mnemoshared/dist/src/dto/model/CurrentDateDTO";
import {CalendarDTO} from "mnemoshared/dist/src/dto/model/calendar/CalendarDTO";
import {PartyDTO} from "mnemoshared/dist/src/dto/model/PartyDTO";

export class CalendarRelatedResponses {
    static async PRINT_DATE(currentDate: CurrentDateDTO, party: PartyDTO, message: Message,
                            calendar: CalendarDTO): Promise<MessageEmbed> {
        if (calendar == null) {
            await message.channel.send(messageResponse.generic.could_not_get.msg(messageTypes.calendar.singular));
            return Promise.resolve(null);
        }

        // Now get the date.
        let date = await MessageUtility.getProperDate(currentDate.date, message, calendar);
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