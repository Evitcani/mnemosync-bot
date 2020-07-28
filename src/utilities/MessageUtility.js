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
const GameDate_1 = require("../entity/GameDate");
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
    static processDateCommand(command, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateCmd = Subcommands_1.Subcommands.DATE.getCommand(command);
            let input = dateCmd.getInput();
            if (input == null) {
                yield message.channel.send("There was no actual date given.");
                return Promise.resolve(null);
            }
            // Split the date and process.
            let dates = input.split("/");
            if (dates.length < 3) {
                yield message.channel.send("Date was malformed. Should be like `[day]/[month]/[year]`");
                return Promise.resolve(null);
            }
            // TODO: Implement era processing.
            let day = StringUtility_1.StringUtility.getNumber(dates[0]), month = StringUtility_1.StringUtility.getNumber(dates[1]), year = StringUtility_1.StringUtility.getNumber(dates[2]);
            // TODO: Better response here.
            if (day == null || month == null || year == null) {
                yield message.channel.send("Date was malformed. Day, month or year was not a number. Should be like " +
                    "`[# day]/[# month]/[# year]`");
                return Promise.resolve(null);
            }
            // Now put it inside the sending.
            let inGameDate = new GameDate_1.GameDate();
            inGameDate.day = day;
            inGameDate.month = month;
            inGameDate.year = year;
            return Promise.resolve(inGameDate);
        });
    }
    static getProperDate(date, message, calendarController) {
        return __awaiter(this, void 0, void 0, function* () {
            let calendar = yield calendarController.get(date.calendarId);
            if (calendar == null) {
                yield message.channel.send("Could not get a calendar.");
                return Promise.resolve(null);
            }
            date.calendarId = calendar.id;
            let day = date.day;
            let month = date.month;
            let year = date.year;
            return `${day}${this.nthOfNumber(day)} of ${this.getMonthName(month, calendar.months)}, ${year} `;
        });
    }
    static getMonthName(month, months) {
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
    static nthOfNumber(n) {
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
exports.MessageUtility = MessageUtility;
//# sourceMappingURL=MessageUtility.js.map