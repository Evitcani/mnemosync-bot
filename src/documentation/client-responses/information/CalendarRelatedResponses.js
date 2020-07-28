"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarRelatedResponses = void 0;
const BasicEmbed_1 = require("../../BasicEmbed");
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
}
exports.CalendarRelatedResponses = CalendarRelatedResponses;
//# sourceMappingURL=CalendarRelatedResponses.js.map