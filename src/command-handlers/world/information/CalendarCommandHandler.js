"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.CalendarCommandHandler = void 0;
const AbstractUserCommandHandler_1 = require("../../base/AbstractUserCommandHandler");
const inversify_1 = require("inversify");
const Subcommands_1 = require("../../../documentation/commands/Subcommands");
const Calendar_1 = require("../../../entity/Calendar");
const GameDate_1 = require("../../../entity/GameDate");
const CalendarWeekDay_1 = require("../../../entity/CalendarWeekDay");
const types_1 = require("../../../types");
const CalendarController_1 = require("../../../controllers/world/calendar/CalendarController");
const CalendarEraController_1 = require("../../../controllers/world/calendar/CalendarEraController");
const CalendarMonthController_1 = require("../../../controllers/world/calendar/CalendarMonthController");
const CalendarMoonController_1 = require("../../../controllers/world/calendar/CalendarMoonController");
const CalendarWeekDayController_1 = require("../../../controllers/world/calendar/CalendarWeekDayController");
const CalendarMonth_1 = require("../../../entity/CalendarMonth");
const CalendarMoon_1 = require("../../../entity/CalendarMoon");
let CalendarCommandHandler = class CalendarCommandHandler extends AbstractUserCommandHandler_1.AbstractUserCommandHandler {
    constructor(calendarController, calendarEraController, calendarMonthController, calendarMoonController, calendarWeekDayController) {
        super();
        this.calendarController = calendarController;
        this.eraController = calendarEraController;
        this.monthController = calendarMonthController;
        this.moonController = calendarMoonController;
        this.weekDayController = calendarWeekDayController;
    }
    handleUserCommand(command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Subcommands_1.Subcommands.DONJON.isCommand(command)) {
                return this.createNewDonjonCalendar(command, message, user);
            }
            return undefined;
        });
    }
    createNewDonjonCalendar(command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            // Return if no default world.
            if (user.defaultWorld == null) {
                return message.channel.send("No default world, could not save calendar.");
            }
            let json = null;
            if (Subcommands_1.Subcommands.DONJON.isCommand(command)) {
                let cmd = Subcommands_1.Subcommands.DONJON.getCommand(command);
                json = JSON.parse(cmd.getInput());
            }
            if (json == null) {
                return message.channel.send("No JSON given, could not continue.");
            }
            let name = null;
            let calendar = new Calendar_1.Calendar();
            if (Subcommands_1.Subcommands.NAME.isCommand(command)) {
                let cmd = Subcommands_1.Subcommands.NAME.getCommand(command);
                name = cmd.getInput();
                // TODO: Check for existing calendar.
            }
            if (name == null) {
                return message.channel.send("No name given, could not continue.");
            }
            // Start parsing the arguments.
            calendar.name = name;
            calendar.world = user.defaultWorld;
            calendar.epoch = new GameDate_1.GameDate();
            calendar.epoch.day = 0;
            calendar.epoch.month = 0;
            calendar.epoch.year = 0;
            // Okay, now we need to save this calendar.
            calendar = yield this.calendarController.save(calendar);
            // Setup basics.
            calendar.week = [];
            calendar.months = [];
            calendar.moons = [];
            // Now begin processing the weeks.
            let i, day;
            for (i = 0; i < json.week_len; i++) {
                day = new CalendarWeekDay_1.CalendarWeekDay();
                day.order = i;
                day.calendar = calendar;
                if (json.weekdays.length >= i) {
                    day.name = json.weekdays[i];
                }
                // Give generic name if none are there.
                if (day.name == null) {
                    day.name = `${i}`;
                }
                // Now we save this calendar.
                day = yield this.weekDayController.save(day);
                calendar.week.push(day);
            }
            // Now process the months.
            let month, month_len, yearLength = 0;
            for (i = 0; i < json.n_months; i++) {
                month = new CalendarMonth_1.CalendarMonth();
                month.order = i;
                month.calendar = calendar;
                if (json.months.length >= i) {
                    month.name = json.months[i];
                }
                // Give generic name if none are there.
                if (month.name == null) {
                    month.name = `${i}`;
                }
                // Get the length of the month.
                month_len = json.month_len[month.name];
                if (month_len != undefined) {
                    month.length = month_len;
                    yearLength += month.length;
                }
                // Now we save this calendar.
                month = yield this.monthController.save(month);
                calendar.months.push(month);
            }
            // Now process the moons.
            let moon, moon_cyc, moon_shf;
            for (i = 0; i < json.n_moons; i++) {
                moon = new CalendarMoon_1.CalendarMoon();
                moon.calendar = calendar;
                if (json.moons.length >= i) {
                    moon.name = json.moons[i];
                }
                // Give generic name if none are there.
                if (moon.name == null) {
                    moon.name = `${i}`;
                }
                // Get the cycle of the moon.
                moon_cyc = json.lunar_cyc[moon.name];
                if (moon_cyc != undefined) {
                    moon.cycle = moon_cyc;
                }
                // Get the shift of the moon.
                moon_shf = json.lunar_shf[moon.name];
                if (moon_shf != undefined) {
                    moon.shift = moon_shf;
                }
                // Now we save this calendar.
                moon = yield this.moonController.save(moon);
                calendar.moons.push(moon);
            }
            // Set the length of the year.
            calendar.yearLength = yearLength;
            // Now save again.
            calendar = yield this.calendarController.save(calendar);
            return message.channel.send("Saved calendar: " + calendar.name);
        });
    }
};
CalendarCommandHandler = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.CalendarController)),
    __param(1, inversify_1.inject(types_1.TYPES.CalendarEraController)),
    __param(2, inversify_1.inject(types_1.TYPES.CalendarMonthController)),
    __param(3, inversify_1.inject(types_1.TYPES.CalendarMoonController)),
    __param(4, inversify_1.inject(types_1.TYPES.CalendarWeekDayController)),
    __metadata("design:paramtypes", [CalendarController_1.CalendarController,
        CalendarEraController_1.CalendarEraController,
        CalendarMonthController_1.CalendarMonthController,
        CalendarMoonController_1.CalendarMoonController,
        CalendarWeekDayController_1.CalendarWeekDayController])
], CalendarCommandHandler);
exports.CalendarCommandHandler = CalendarCommandHandler;
//# sourceMappingURL=CalendarCommandHandler.js.map