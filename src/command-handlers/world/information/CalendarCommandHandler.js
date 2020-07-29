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
const StringUtility_1 = require("../../../utilities/StringUtility");
const CalendarMoonPhase_1 = require("../../../entity/CalendarMoonPhase");
const CalendarMoonPhaseController_1 = require("../../../controllers/world/calendar/CalendarMoonPhaseController");
let CalendarCommandHandler = class CalendarCommandHandler extends AbstractUserCommandHandler_1.AbstractUserCommandHandler {
    constructor(calendarController, calendarEraController, calendarMonthController, calendarMoonController, calendarMoonPhaseController, calendarWeekDayController) {
        super();
        this.calendarController = calendarController;
        this.eraController = calendarEraController;
        this.monthController = calendarMonthController;
        this.moonController = calendarMoonController;
        this.phaseController = calendarMoonPhaseController;
        this.weekDayController = calendarWeekDayController;
    }
    handleUserCommand(command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Subcommands_1.Subcommands.DONJON.isCommand(command)) {
                return this.createNewDonjonCalendar(command, message, user);
            }
            if (Subcommands_1.Subcommands.WORLD_ANVIL.isCommand(command)) {
                return this.createNewWorldAnvilCalendar(command, message, user);
            }
            return undefined;
        });
    }
    createNewWorldAnvilCalendar(command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let json = null;
            if (Subcommands_1.Subcommands.WORLD_ANVIL.isCommand(command)) {
                let cmd = Subcommands_1.Subcommands.WORLD_ANVIL.getCommand(command);
                json = JSON.parse(cmd.getInput());
            }
            if (json == null) {
                return message.channel.send("No JSON given, could not continue.");
            }
            let name = null;
            if (Subcommands_1.Subcommands.NAME.isCommand(command)) {
                name = json.name;
            }
            let calendar = yield this.getCalendar(name, user, message);
            // Process the week days.
            calendar.week = yield this.processWeekDays(json.daysPerWeek, json.days, calendar);
            // Now process the months.
            if (!!json.months) {
                // Check if months already exist, then delete.
                if (calendar.months != null && calendar.months.length > 0) {
                    yield this.monthController.delete(calendar);
                    // Set the length of the year.
                    calendar.yearLength = 0;
                }
                // Processing.
                let month, monthWa, yearLength = 0, i;
                for (i = 0; i < json.monthsPerYear; i++) {
                    month = new CalendarMonth_1.CalendarMonth();
                    month.order = i;
                    month.calendar = calendar;
                    monthWa = json.months[i];
                    // Now break down this...
                    month.name = monthWa.name;
                    month.description = monthWa.desc;
                    month.length = StringUtility_1.StringUtility.getNumber(monthWa.length);
                    // Add up the year...
                    yearLength += month.length;
                    // Give generic name if none are there.
                    if (month.name == null) {
                        month.name = `${i}`;
                    }
                    // Now we save this month.
                    month = yield this.monthController.save(month);
                    calendar.months.push(month);
                }
                // Set the length of the year.
                calendar.yearLength = yearLength;
            }
            calendar = yield this.createWorldAnvilCelestials(json, calendar);
            // Now save again.
            calendar = yield this.calendarController.save(calendar);
            return message.channel.send("Saved calendar: " + calendar.name);
        });
    }
    createWorldAnvilCelestials(json, calendar) {
        return __awaiter(this, void 0, void 0, function* () {
            // Nothing to process.
            if (json.celestials == undefined || json.celestials.length <= 0) {
                return Promise.resolve(calendar);
            }
            // Delete older moons.
            if (calendar.moons != null && calendar.moons.length > 0) {
                yield this.moonController.delete(calendar);
            }
            // Now process the moons.
            let moon, moonWa, phase, i;
            for (i = 0; i < json.celestialBodyCount; i++) {
                moon = new CalendarMoon_1.CalendarMoon();
                moon.calendar = calendar;
                moonWa = json.celestials[i];
                // Set these up.
                moon.name = moonWa.name;
                moon.description = moonWa.desc;
                moon.shift = StringUtility_1.StringUtility.getNumber(moonWa.shift);
                moon.cycle = StringUtility_1.StringUtility.getNumber(moonWa.cycle);
                // Give generic name if none are there.
                if (moon.name == null) {
                    moon.name = `${i}`;
                }
                // Now we save this calendar.
                moon = yield this.moonController.save(moon);
                calendar.moons.push(moon);
                // Start to process the phases.
                moon.phases = [];
                // Full moon.
                phase = yield this.createNewPhase(moonWa.phaseNames.full, 337, 22, 0, moon);
                moon.phases.push(phase);
                phase = yield this.createNewPhase(moonWa.phaseNames.waxingGibbous, 22, 67, 1, moon);
                moon.phases.push(phase);
                phase = yield this.createNewPhase(moonWa.phaseNames.waxingQuarter, 67, 112, 2, moon);
                moon.phases.push(phase);
                phase = yield this.createNewPhase(moonWa.phaseNames.waxingCrescent, 112, 157, 3, moon);
                moon.phases.push(phase);
                phase = yield this.createNewPhase(moonWa.phaseNames.old, 157, 167, 4, moon);
                moon.phases.push(phase);
                phase = yield this.createNewPhase(moonWa.phaseNames.new, 167, 192, 5, moon);
                moon.phases.push(phase);
                phase = yield this.createNewPhase(moonWa.phaseNames.young, 192, 202, 6, moon);
                moon.phases.push(phase);
                phase = yield this.createNewPhase(moonWa.phaseNames.waningCrescent, 202, 247, 7, moon);
                moon.phases.push(phase);
                phase = yield this.createNewPhase(moonWa.phaseNames.waningQuarter, 247, 292, 8, moon);
                moon.phases.push(phase);
                phase = yield this.createNewPhase(moonWa.phaseNames.waningGibbous, 292, 337, 9, moon);
                moon.phases.push(phase);
            }
            return Promise.resolve(calendar);
        });
    }
    createNewPhase(name, viewingAngleStart, viewingAngleEnd, order, moon) {
        return __awaiter(this, void 0, void 0, function* () {
            let phase = new CalendarMoonPhase_1.CalendarMoonPhase();
            phase.name = name;
            phase.viewingAngleStart = viewingAngleStart;
            phase.viewingAngleEnd = viewingAngleEnd;
            phase.order = order;
            phase.moon = moon;
            return this.phaseController.save(phase);
        });
    }
    createNewDonjonCalendar(command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let json = null;
            if (Subcommands_1.Subcommands.DONJON.isCommand(command)) {
                let cmd = Subcommands_1.Subcommands.DONJON.getCommand(command);
                json = JSON.parse(cmd.getInput());
            }
            if (json == null) {
                return message.channel.send("No JSON given, could not continue.");
            }
            let name = null;
            if (Subcommands_1.Subcommands.NAME.isCommand(command)) {
                let cmd = Subcommands_1.Subcommands.NAME.getCommand(command);
                name = cmd.getInput();
            }
            let calendar = yield this.getCalendar(name, user, message);
            // Now begin processing the weeks.
            calendar.week = yield this.processWeekDays(json.week_len, json.weekdays, calendar);
            // Now process the months.
            if (!!json.months) {
                // Check if months already exist, then delete.
                if (calendar.months != null && calendar.months.length > 0) {
                    yield this.monthController.delete(calendar);
                }
                // Processing.
                let month, month_len, yearLength = 0, i;
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
                // Set the length of the year.
                calendar.yearLength = yearLength;
            }
            // Now process the moons.
            if (json.moons != undefined && json.moons.length > 0) {
                // Delete older moons.
                if (calendar.moons != null && calendar.moons.length > 0) {
                    yield this.moonController.delete(calendar);
                }
                // Processing
                let moon, moon_cyc, moon_shf, phase, i;
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
                    moon.phases = [];
                    phase = yield this.createNewPhase("Full", 337, 22, 0, moon);
                    moon.phases.push(phase);
                    phase = yield this.createNewPhase("Waxing Gibbous", 22, 67, 1, moon);
                    moon.phases.push(phase);
                    phase = yield this.createNewPhase("First Quarter", 67, 112, 2, moon);
                    moon.phases.push(phase);
                    phase = yield this.createNewPhase("Waxing Crescent", 112, 157, 3, moon);
                    moon.phases.push(phase);
                    phase = yield this.createNewPhase("Old", 157, 167, 4, moon);
                    moon.phases.push(phase);
                    phase = yield this.createNewPhase("New", 167, 192, 5, moon);
                    moon.phases.push(phase);
                    phase = yield this.createNewPhase("Young", 192, 202, 6, moon);
                    moon.phases.push(phase);
                    phase = yield this.createNewPhase("Waning Crescent", 202, 247, 7, moon);
                    moon.phases.push(phase);
                    phase = yield this.createNewPhase("Last Quarter", 247, 292, 8, moon);
                    moon.phases.push(phase);
                    phase = yield this.createNewPhase("Waning Gibbous", 292, 337, 9, moon);
                    moon.phases.push(phase);
                }
            }
            // Now save again.
            calendar = yield this.calendarController.save(calendar);
            return message.channel.send("Saved calendar: " + calendar.name);
        });
    }
    getCalendar(name, user, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let calendar;
            // Check for existing calendar.
            if (name != null && user.defaultWorldId != null) {
                let calendars = yield this.calendarController.getByName(name, user.defaultWorldId);
                if (calendars != null && calendars.length > 0) {
                    let tempCalendar = new Calendar_1.Calendar();
                    tempCalendar.name = "No, create a new calendar";
                    calendars.push(tempCalendar);
                    calendar = yield this.calendarController.calendarSelection(calendars, "modify", message);
                    if (!calendar.id) {
                        calendar = null;
                    }
                    else {
                        calendar = yield this.calendarController.get(calendar.id);
                    }
                }
            }
            // Get basic calendar.
            if (calendar == null) {
                calendar = yield this.basicCalendar(name, message, user);
            }
            return Promise.resolve(calendar);
        });
    }
    basicCalendar(name, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            // Return if no default world.
            if (user.defaultWorld == null) {
                yield message.channel.send("No default world, could not save calendar.");
                return Promise.resolve(null);
            }
            let calendar = new Calendar_1.Calendar();
            if (name == null) {
                yield message.channel.send("No name given, could not continue.");
                return Promise.resolve(null);
            }
            // Start parsing the arguments.
            calendar.name = name;
            calendar.world = user.defaultWorld;
            calendar.epoch = new GameDate_1.GameDate();
            calendar.epoch.day = 0;
            calendar.epoch.month = 0;
            calendar.epoch.year = 0;
            calendar.yearLength = 0;
            // Okay, now we need to save this calendar.
            calendar = yield this.calendarController.save(calendar);
            // Setup basics.
            calendar.week = [];
            calendar.months = [];
            calendar.moons = [];
            return Promise.resolve(calendar);
        });
    }
    processWeekDays(daysPerWeek, weekdays, calendar) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!weekdays) {
                return Promise.resolve(null);
            }
            // Delete the old week days.
            if (calendar.week != null && calendar.week.length > 0) {
                yield this.weekDayController.delete(calendar);
            }
            let week = [];
            let i, day;
            for (i = 0; i < daysPerWeek; i++) {
                day = new CalendarWeekDay_1.CalendarWeekDay();
                day.order = i;
                day.calendar = calendar;
                if (weekdays.length >= i) {
                    day.name = weekdays[i];
                }
                // Give generic name if none are there.
                if (day.name == null) {
                    day.name = `${i}`;
                }
                // Now we save this calendar.
                day = yield this.weekDayController.save(day);
                week.push(day);
            }
            return Promise.resolve(week);
        });
    }
};
CalendarCommandHandler = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.CalendarController)),
    __param(1, inversify_1.inject(types_1.TYPES.CalendarEraController)),
    __param(2, inversify_1.inject(types_1.TYPES.CalendarMonthController)),
    __param(3, inversify_1.inject(types_1.TYPES.CalendarMoonController)),
    __param(4, inversify_1.inject(types_1.TYPES.CalendarMoonPhaseController)),
    __param(5, inversify_1.inject(types_1.TYPES.CalendarWeekDayController)),
    __metadata("design:paramtypes", [CalendarController_1.CalendarController,
        CalendarEraController_1.CalendarEraController,
        CalendarMonthController_1.CalendarMonthController,
        CalendarMoonController_1.CalendarMoonController,
        CalendarMoonPhaseController_1.CalendarMoonPhaseController,
        CalendarWeekDayController_1.CalendarWeekDayController])
], CalendarCommandHandler);
exports.CalendarCommandHandler = CalendarCommandHandler;
//# sourceMappingURL=CalendarCommandHandler.js.map