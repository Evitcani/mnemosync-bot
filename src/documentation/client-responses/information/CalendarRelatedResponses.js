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
exports.CalendarRelatedResponses = void 0;
const BasicEmbed_1 = require("../../BasicEmbed");
const MessageUtility_1 = require("../../../utilities/MessageUtility");
class CalendarRelatedResponses {
    static SELECT_CALENDAR(calendars, action) {
        let worldStr = "";
        let calendar, i;
        for (i = 0; i < calendars.length; i++) {
            calendar = calendars[i];
            worldStr += `[\`${i}\`] ${calendar.name}\n`;
        }
        return BasicEmbed_1.BasicEmbed.get()
            .setTitle(`Please select which calendar you want to ${action}`)
            .setDescription(`Select from the following calendars by pressing the given number:\n` +
            worldStr);
    }
    static PRINT_DATE(currentDate, party, message, calendarController) {
        return __awaiter(this, void 0, void 0, function* () {
            let calendar = yield calendarController.get(currentDate.calendarId);
            if (calendar == null) {
                yield message.channel.send("Could not get a calendar.");
                return Promise.resolve(null);
            }
            // Now get the date.
            let date = yield MessageUtility_1.MessageUtility.getProperDate(currentDate.date, message, calendar, calendarController);
            if (date == null) {
                return null;
            }
            let embed = BasicEmbed_1.BasicEmbed.get()
                .setTitle(`Current date for ${party.name}`)
                .setDescription(`It's the ${date}.`);
            if (calendar.moons.length > 0 && calendar.moons.length <= 22) {
                calendar.moons.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
                calendar.moons.forEach((value) => {
                    embed.addField(value.name, MessageUtility_1.MessageUtility.getMoonPhase(value, currentDate.date.day, calendar.yearLength), true);
                });
            }
            return embed;
        });
    }
}
exports.CalendarRelatedResponses = CalendarRelatedResponses;
//# sourceMappingURL=CalendarRelatedResponses.js.map