import {Command} from "../../../../shared/models/generic/Command";
import {Message} from "discord.js";
import {AbstractUserCommandHandler} from "../../base/AbstractUserCommandHandler";
import {inject, injectable} from "inversify";
import {Subcommands} from "../../../../shared/documentation/commands/Subcommands";
import {DonjonCalendar} from "../../../../shared/models/generic/DonjonCalendar";
import {TYPES} from "../../../../types";
import {CalendarController} from "../../../../backend/controllers/world/calendar/CalendarController";
import {CalendarEraController} from "../../../../backend/controllers/world/calendar/CalendarEraController";
import {CalendarMonthController} from "../../../../backend/controllers/world/calendar/CalendarMonthController";
import {CalendarMoonController} from "../../../../backend/controllers/world/calendar/CalendarMoonController";
import {CalendarWeekDayController} from "../../../../backend/controllers/world/calendar/CalendarWeekDayController";
import {WorldAnvilCalendar} from "../../../../shared/models/generic/world-anvil/calendar/WorldAnvilCalendar";
import {WorldAnvilMonth} from "../../../../shared/models/generic/world-anvil/calendar/WorldAnvilMonth";
import {StringUtility} from "../../../../backend/utilities/StringUtility";
import {WorldAnvilCelestial} from "../../../../shared/models/generic/world-anvil/calendar/WorldAnvilCelestial";
import {CalendarMoonPhaseController} from "../../../../backend/controllers/world/calendar/CalendarMoonPhaseController";
import {UserDTO} from "../../../../backend/api/dto/model/UserDTO";
import {CalendarDTO} from "../../../../backend/api/dto/model/calendar/CalendarDTO";
import {CalendarMonthDTO} from "../../../../backend/api/dto/model/calendar/CalendarMonthDTO";
import {CalendarWeekDayDTO} from "../../../../backend/api/dto/model/calendar/CalendarWeekDayDTO";
import {CalendarMoonDTO} from "../../../../backend/api/dto/model/calendar/CalendarMoonDTO";
import {CalendarMoonPhaseDTO} from "../../../../backend/api/dto/model/calendar/CalendarMoonPhaseDTO";
import {DTOType} from "../../../../backend/api/dto/DTOType";

@injectable()
export class CalendarCommandHandler extends AbstractUserCommandHandler {
    private calendarController: CalendarController;
    private eraController: CalendarEraController;
    private monthController: CalendarMonthController;
    private moonController: CalendarMoonController;
    private phaseController: CalendarMoonPhaseController;
    private weekDayController: CalendarWeekDayController;

    constructor(@inject(TYPES.CalendarController) calendarController: CalendarController,
                @inject(TYPES.CalendarEraController) calendarEraController: CalendarEraController,
                @inject(TYPES.CalendarMonthController) calendarMonthController: CalendarMonthController,
                @inject(TYPES.CalendarMoonController) calendarMoonController: CalendarMoonController,
                @inject(TYPES.CalendarMoonPhaseController) calendarMoonPhaseController: CalendarMoonPhaseController,
                @inject(TYPES.CalendarWeekDayController) calendarWeekDayController: CalendarWeekDayController) {
        super();
        this.calendarController = calendarController;
        this.eraController = calendarEraController;
        this.monthController = calendarMonthController;
        this.moonController = calendarMoonController;
        this.phaseController = calendarMoonPhaseController;
        this.weekDayController = calendarWeekDayController;
    }

    async handleUserCommand(command: Command, message: Message, user: UserDTO): Promise<Message | Message[]> {
        if (Subcommands.DONJON.isCommand(command)) {
            return this.createNewDonjonCalendar(command, message, user);
        }

        if (Subcommands.WORLD_ANVIL.isCommand(command)) {
            return this.createNewWorldAnvilCalendar(command, message, user);
        }

        return undefined;
    }

    private async createNewWorldAnvilCalendar(command: Command, message: Message, user: UserDTO): Promise<Message | Message[]> {
        let json: WorldAnvilCalendar = null;
        if (Subcommands.WORLD_ANVIL.isCommand(command)) {
            let cmd = Subcommands.WORLD_ANVIL.getCommand(command);
            json = JSON.parse(cmd.getInput());
        }

        if (json == null) {
            return message.channel.send("No JSON given, could not continue.");
        }

        let name = json.name;

        let calendar: CalendarDTO = await this.getCalendar(name, user, message);
        if (calendar == null) {
            return null;
        }

        // Process the week days.
        calendar.week = await this.processWeekDays(json.daysPerWeek, json.days, calendar);

        // Now process the months.
        if (!!json.months) {
            // Check if months already exist, then delete.
            if (calendar.months != null && calendar.months.length > 0) {
                await this.monthController.delete(calendar);

                // Set the length of the year.
                calendar.yearLength = 0;
            }

            // Processing.
            let month: CalendarMonthDTO, monthWa:WorldAnvilMonth, yearLength = 0, i;
            for (i = 0; i < json.monthsPerYear; i++) {
                month = new CalendarMonth();
                month.order = i;
                month.calendar = calendar;
                monthWa = json.months[i];

                // Now break down this...
                month.name = monthWa.name;
                month.description = monthWa.desc;
                month.length = StringUtility.getNumber(monthWa.length);

                // Add up the year...
                yearLength += month.length;

                // Give generic name if none are there.
                if (month.name == null) {
                    month.name = `${i}`;
                }

                // Now we save this month.
                month = await this.monthController.save(month);
                calendar.months.push(month);
            }

            // Set the length of the year.
            calendar.yearLength = yearLength;
        }

        calendar = await this.createWorldAnvilCelestials(json, calendar);

        // Now save again.
        calendar = await this.calendarController.save(calendar);

        return message.channel.send("Saved calendar: " + calendar.name);
    }

    private async createWorldAnvilCelestials(json: WorldAnvilCalendar, calendar: Calendar): Promise<Calendar> {
        // Nothing to process.
        if (json.celestials == undefined || json.celestials.length <= 0) {
            return Promise.resolve(calendar);
        }

        // Delete older moons.
        if (calendar.moons != null && calendar.moons.length > 0) {
            await this.moonController.delete(calendar);
        }

        // Now process the moons.
        let moon: CalendarMoon, moonWa: WorldAnvilCelestial, phase: CalendarMoonPhase, i;
        for (i = 0; i < json.celestialBodyCount; i++) {
            moon = new CalendarMoon();
            moon.calendar = calendar;
            moonWa = json.celestials[i];

            // Set these up.
            moon.name = moonWa.name;
            moon.description = moonWa.desc;
            moon.shift = StringUtility.getNumber(moonWa.shift);
            moon.cycle = StringUtility.getNumber(moonWa.cycle);

            // Give generic name if none are there.
            if (moon.name == null) {
                moon.name = `${i}`;
            }

            // Now we save this calendar.
            moon = await this.moonController.save(moon);
            calendar.moons.push(moon);

            // Start to process the phases.
            moon.phases = [];

            // Full moon.
            phase = await this.createNewPhase(moonWa.phaseNames.full, 337, 22, 0, moon);
            moon.phases.push(phase);

            phase = await this.createNewPhase(moonWa.phaseNames.waxingGibbous, 22, 67, 1, moon);
            moon.phases.push(phase);

            phase = await this.createNewPhase(moonWa.phaseNames.waxingQuarter, 67, 112, 2, moon);
            moon.phases.push(phase);

            phase = await this.createNewPhase(moonWa.phaseNames.waxingCrescent, 112, 157, 3, moon);
            moon.phases.push(phase);

            phase = await this.createNewPhase(moonWa.phaseNames.old, 157, 167, 4, moon);
            moon.phases.push(phase);

            phase = await this.createNewPhase(moonWa.phaseNames.new, 167, 192, 5, moon);
            moon.phases.push(phase);

            phase = await this.createNewPhase(moonWa.phaseNames.young, 192, 202, 6, moon);
            moon.phases.push(phase);

            phase = await this.createNewPhase(moonWa.phaseNames.waningCrescent, 202, 247, 7, moon);
            moon.phases.push(phase);

            phase = await this.createNewPhase(moonWa.phaseNames.waningQuarter, 247, 292, 8, moon);
            moon.phases.push(phase);

            phase = await this.createNewPhase(moonWa.phaseNames.waningGibbous, 292, 337, 9, moon);
            moon.phases.push(phase);
        }

        return Promise.resolve(calendar);
    }

    private async createNewPhase(name: string, viewingAngleStart: number, viewingAngleEnd: number, order: number, moon: CalendarMoon): Promise<CalendarMoonPhase> {
        let phase = new CalendarMoonPhase();
        phase.name = name;
        phase.viewingAngleStart = viewingAngleStart;
        phase.viewingAngleEnd = viewingAngleEnd;
        phase.order = order;
        phase.moon = moon;
        return this.phaseController.save(phase);
    }

    private async createNewDonjonCalendar(command: Command, message: Message, user: User): Promise<Message | Message[]> {
        let json: DonjonCalendar = null;
        if (Subcommands.DONJON.isCommand(command)) {
            let cmd = Subcommands.DONJON.getCommand(command);
            json = JSON.parse(cmd.getInput());
        }

        if (json == null) {
            return message.channel.send("No JSON given, could not continue.");
        }

        let name = null;
        if (Subcommands.NAME.isCommand(command)) {
            let cmd = Subcommands.NAME.getCommand(command);
            name = cmd.getInput();
        }

        let calendar: Calendar = await this.getCalendar(name, user, message);
        if (calendar == null) {
            return null;
        }

        // Now begin processing the weeks.
        calendar.week = await this.processWeekDays(json.week_len, json.weekdays, calendar);

        // Now process the months.
        if (!!json.months) {
            // Check if months already exist, then delete.
            if (calendar.months != null && calendar.months.length > 0) {
                await this.monthController.delete(calendar);
            }

            // Processing.
            let month: CalendarMonth, month_len: number, yearLength = 0, i;
            for (i = 0; i < json.n_months; i++) {
                month = new CalendarMonth();
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
                month = await this.monthController.save(month);
                calendar.months.push(month);
            }

            // Set the length of the year.
            calendar.yearLength = yearLength;
        }

        // Now process the moons.
        if  (json.moons != undefined && json.moons.length > 0) {
            // Delete older moons.
            if (calendar.moons != null && calendar.moons.length > 0) {
                await this.moonController.delete(calendar);
            }

            // Processing
            let moon: CalendarMoonDTO, moon_cyc: number, moon_shf: number, phase: CalendarMoonPhaseDTO, i;
            for (i = 0; i < json.n_moons; i++) {
                moon = {};
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
                moon = await this.moonController.save(moon);
                calendar.moons.push(moon);

                moon.phases = [];

                phase = await this.createNewPhase("Full", 337, 22, 0, moon);
                moon.phases.push(phase);

                phase = await this.createNewPhase("Waxing Gibbous", 22, 67, 1, moon);
                moon.phases.push(phase);

                phase = await this.createNewPhase("First Quarter", 67, 112, 2, moon);
                moon.phases.push(phase);

                phase = await this.createNewPhase("Waxing Crescent", 112, 157, 3, moon);
                moon.phases.push(phase);

                phase = await this.createNewPhase("Old", 157, 167, 4, moon);
                moon.phases.push(phase);

                phase = await this.createNewPhase("New", 167, 192, 5, moon);
                moon.phases.push(phase);

                phase = await this.createNewPhase("Young", 192, 202, 6, moon);
                moon.phases.push(phase);

                phase = await this.createNewPhase("Waning Crescent", 202, 247, 7, moon);
                moon.phases.push(phase);

                phase = await this.createNewPhase("Last Quarter", 247, 292, 8, moon);
                moon.phases.push(phase);

                phase = await this.createNewPhase("Waning Gibbous", 292, 337, 9, moon);
                moon.phases.push(phase);
            }
        }

        // Now save again.
        calendar = await this.calendarController.save(calendar);

        return message.channel.send("Saved calendar: " + calendar.name);
    }

    private async getCalendar(name: string, user: UserDTO, message: Message): Promise<CalendarDTO> {
        let calendar: CalendarDTO;
        // Check for existing calendar.
        if (name != null && user.defaultWorldId != null) {
            let calendars = await this.calendarController.getByName(name, user.defaultWorldId);
            if (calendars != null && calendars.length > 0) {
                let tempCalendar: CalendarDTO = {};
                tempCalendar.name = "No, create a new calendar";
                calendars.push(tempCalendar);

                calendar = await this.calendarController.calendarSelection(calendars, "modify", message);

                if (!calendar.id) {
                    calendar = null;
                } else {
                    calendar = await this.calendarController.get(calendar.id);
                }
            }
        }

        // Get basic calendar.
        if (calendar == null) {
            calendar = await this.basicCalendar(name, message, user);
        }

        return Promise.resolve(calendar);
    }

    private async basicCalendar(name: string, message: Message, user: UserDTO): Promise<CalendarDTO> {
        // Return if no default world.
        if (user.defaultWorld == null) {
            await message.channel.send("No default world, could not save calendar.");
            return Promise.resolve(null);
        }

        let calendar: CalendarDTO = {dtoType: DTOType.CALENDAR};

        if (name == null) {
            await message.channel.send("No name given, could not continue.");
            return Promise.resolve(null);
        }

        // Start parsing the arguments.
        calendar.name = name;
        calendar.world = user.defaultWorld;
        calendar.epoch = {dtoType: DTOType.DATE};
        calendar.epoch.day = 0;
        calendar.epoch.month = 0;
        calendar.epoch.year = 0;
        calendar.yearLength = 0;

        // TODO: Should be "Create"
        calendar = await this.calendarController.save(calendar);

        // Setup basics.
        calendar.week = [];
        calendar.months = [];
        calendar.moons = [];

        return Promise.resolve(calendar);
    }

    private async processWeekDays(daysPerWeek: number, weekdays: string[], calendar: CalendarDTO): Promise<CalendarWeekDayDTO[]> {
        if (!weekdays) {
            return Promise.resolve(null);
        }

        // Delete the old week days.
        if (calendar.week != null && calendar.week.length > 0) {
            await this.weekDayController.delete(calendar);
        }

        let week: CalendarWeekDayDTO[] = [];
        let i, day: CalendarWeekDayDTO;
        for (i = 0; i < daysPerWeek; i++) {
            day = {dtoType: DTOType.CALENDAR_WEEK_DAY};
            day.order = i;
            if (weekdays.length >= i) {
                day.name = weekdays[i];
            }

            // Give generic name if none are there.
            if (day.name == null) {
                day.name = `${i}`;
            }

            // Now we save this calendar.
            day = await this.weekDayController.save(day);
            week.push(day);
        }

        return Promise.resolve(week);
    }
}