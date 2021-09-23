import {Command} from "../../../../shared/models/generic/Command";
import {Message, MessageAttachment} from "discord.js";
import {AbstractUserCommandHandler} from "../../base/AbstractUserCommandHandler";
import {inject, injectable} from "inversify";
import {Subcommands} from "../../../../shared/documentation/commands/Subcommands";
import {DonjonCalendar} from "../../../../shared/models/generic/DonjonCalendar";
import {TYPES} from "../../../../types";
import {CalendarController} from "../../../../backend/controllers/world/CalendarController";
import {WorldAnvilCalendar} from "../../../../shared/models/generic/world-anvil/calendar/WorldAnvilCalendar";
import {WorldAnvilMonth} from "../../../../shared/models/generic/world-anvil/calendar/WorldAnvilMonth";
import {WorldAnvilCelestial} from "../../../../shared/models/generic/world-anvil/calendar/WorldAnvilCelestial";
import {UserDTO} from "mnemoshared/dist/src/dto/model/UserDTO";
import {CalendarDTO} from "mnemoshared/dist/src/dto/model/calendar/CalendarDTO";
import {CalendarMonthDTO} from "mnemoshared/dist/src/dto/model/calendar/CalendarMonthDTO";
import {DTOType} from "mnemoshared/dist/src/dto/DTOType";
import {StringUtility} from "mnemoshared/dist/src/utilities/StringUtility";
import {CalendarMoonDTO} from "mnemoshared/dist/src/dto/model/calendar/CalendarMoonDTO";
import {CalendarMoonPhaseDTO} from "mnemoshared/dist/src/dto/model/calendar/CalendarMoonPhaseDTO";
import {CalendarWeekDayDTO} from "mnemoshared/dist/src/dto/model/calendar/CalendarWeekDayDTO";
import * as request from 'request-promise';

@injectable()
export class CalendarCommandHandler extends AbstractUserCommandHandler {
    /** Controller for the calendar. */
    private calendarController: CalendarController;

    constructor(@inject(TYPES.CalendarController) calendarController: CalendarController) {
        super();
        this.calendarController = calendarController;
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

    private static async getAttachmentContent(attachment: MessageAttachment): Promise<JSON> {
        if (attachment.proxyURL == null || !attachment.proxyURL.endsWith('.txt')) {
            return Promise.resolve(null);
        }
        return request({
            uri: `${attachment.url}`,
            json: true,
            method: 'GET'
        });
    }

    private async createNewWorldAnvilCalendar(command: Command, message: Message, user: UserDTO): Promise<Message | Message[]> {
        let json: WorldAnvilCalendar = null;

        // Big calendar request.
        if (message.attachments != null) {
            let i, keys = Array.from(message.attachments.keys()), attachment: MessageAttachment;
            for (i = 0; i < keys.length; i++) {
                attachment = message.attachments.get(keys[i]);
                let content = await CalendarCommandHandler.getAttachmentContent(attachment);
                if (content != null) {
                    // @ts-ignore
                    json = content;
                    break;
                }
            }
        }

        if (json == null && Subcommands.WORLD_ANVIL.isCommand(command)) {
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
        calendar.week = CalendarCommandHandler.processWeekDays(json.daysPerWeek, json.days, calendar);

        // Now process the months.
        if (!!json.months) {
            calendar.months = [];

            // Processing.
            let month: CalendarMonthDTO, monthWa:WorldAnvilMonth, yearLength = 0, i;
            for (i = 0; i < json.monthsPerYear; i++) {
                month = {dtoType: DTOType.CALENDAR_MONTH};
                month.order = i;
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
                calendar.months.push(month);
            }

            // Set the length of the year.
            calendar.yearLength = yearLength;
        }

        calendar = await CalendarCommandHandler.createWorldAnvilCelestials(json, calendar);

        // Now save again.
        calendar = await this.calendarController.save(calendar);

        return message.channel.send("Saved calendar: " + calendar.name);
    }

    private static createWorldAnvilCelestials(json: WorldAnvilCalendar, calendar: CalendarDTO): CalendarDTO {
        // Nothing to process.
        if (json.celestials == undefined || json.celestials.length <= 0) {
            return calendar;
        }

        calendar.moons = [];

        // Now process the moons.
        let moon: CalendarMoonDTO, moonWa: WorldAnvilCelestial, phase: CalendarMoonPhaseDTO, i;
        for (i = 0; i < json.celestialBodyCount; i++) {
            moon = {dtoType: DTOType.CALENDAR_MOON};
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
            calendar.moons.push(moon);

            // Start to process the phases.
            moon.phases = [];

            // Full moon.
            phase = this.createNewPhase(moonWa.phaseNames.full, 337, 22, 0);
            moon.phases.push(phase);

            phase = this.createNewPhase(moonWa.phaseNames.waxingGibbous, 22, 67, 1);
            moon.phases.push(phase);

            phase = this.createNewPhase(moonWa.phaseNames.waxingQuarter, 67, 112, 2);
            moon.phases.push(phase);

            phase = this.createNewPhase(moonWa.phaseNames.waxingCrescent, 112, 157, 3);
            moon.phases.push(phase);

            phase = this.createNewPhase(moonWa.phaseNames.old, 157, 167, 4);
            moon.phases.push(phase);

            phase = this.createNewPhase(moonWa.phaseNames.new, 167, 192, 5);
            moon.phases.push(phase);

            phase = this.createNewPhase(moonWa.phaseNames.young, 192, 202, 6);
            moon.phases.push(phase);

            phase = this.createNewPhase(moonWa.phaseNames.waningCrescent, 202, 247, 7);
            moon.phases.push(phase);

            phase = this.createNewPhase(moonWa.phaseNames.waningQuarter, 247, 292, 8);
            moon.phases.push(phase);

            phase = this.createNewPhase(moonWa.phaseNames.waningGibbous, 292, 337, 9);
            moon.phases.push(phase);
        }

        return calendar;
    }

    private static createNewPhase(name: string, viewingAngleStart: number, viewingAngleEnd: number,
                                  order: number): CalendarMoonPhaseDTO {
        let phase: CalendarMoonPhaseDTO = {dtoType: DTOType.CALENDAR_MOON_PHASE};
        phase.name = name;
        phase.viewingAngleStart = viewingAngleStart;
        phase.viewingAngleEnd = viewingAngleEnd;
        phase.order = order;
        return phase;
    }

    private async createNewDonjonCalendar(command: Command, message: Message, user: UserDTO): Promise<Message | Message[]> {
        let json: DonjonCalendar = null;
        // Big calendar request.
        if (message.attachments != null) {
            let i, keys = Array.from(message.attachments.keys()), attachment: MessageAttachment;
            for (i = 0; i < keys.length; i++) {
                attachment = message.attachments.get(keys[i]);
                let content = await CalendarCommandHandler.getAttachmentContent(attachment);
                if (content != null) {
                    // @ts-ignore
                    json = content;
                    break;
                }
            }
        }

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

        let calendar: CalendarDTO = await this.getCalendar(name, user, message);
        if (calendar == null) {
            return null;
        }

        // Now begin processing the weeks.
        calendar.week = await CalendarCommandHandler.processWeekDays(json.week_len, json.weekdays, calendar);

        // Now process the months.
        if (!!json.months) {
            calendar.months = [];

            // Processing.
            let month: CalendarMonthDTO, month_len: number, yearLength = 0, i;
            for (i = 0; i < json.n_months; i++) {
                month = {dtoType: DTOType.CALENDAR_MONTH};
                month.order = i;
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
                calendar.months.push(month);
            }

            // Set the length of the year.
            calendar.yearLength = yearLength;
        }

        // Now process the moons.
        if  (json.moons != undefined && json.moons.length > 0) {
            calendar.moons = [];

            // Processing
            let moon: CalendarMoonDTO, moon_cyc: number, moon_shf: number, phase: CalendarMoonPhaseDTO, i;
            for (i = 0; i < json.n_moons; i++) {
                moon = {dtoType: DTOType.CALENDAR_MOON};
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
                calendar.moons.push(moon);

                moon.phases = [];

                phase = await CalendarCommandHandler.createNewPhase("Full", 337, 22, 0);
                moon.phases.push(phase);

                phase = await CalendarCommandHandler.createNewPhase("Waxing Gibbous", 22, 67, 1);
                moon.phases.push(phase);

                phase = await CalendarCommandHandler.createNewPhase("First Quarter", 67, 112, 2);
                moon.phases.push(phase);

                phase = await CalendarCommandHandler.createNewPhase("Waxing Crescent", 112, 157, 3);
                moon.phases.push(phase);

                phase = await CalendarCommandHandler.createNewPhase("Old", 157, 167, 4);
                moon.phases.push(phase);

                phase = await CalendarCommandHandler.createNewPhase("New", 167, 192, 5);
                moon.phases.push(phase);

                phase = await CalendarCommandHandler.createNewPhase("Young", 192, 202, 6);
                moon.phases.push(phase);

                phase = await CalendarCommandHandler.createNewPhase("Waning Crescent", 202, 247, 7);
                moon.phases.push(phase);

                phase = await CalendarCommandHandler.createNewPhase("Last Quarter", 247, 292, 8);
                moon.phases.push(phase);

                phase = await CalendarCommandHandler.createNewPhase("Waning Gibbous", 292, 337, 9);
                moon.phases.push(phase);
            }
        }

        // Now save again.
        calendar = await this.calendarController.save(calendar);

        return message.channel.send("Saved calendar: " + calendar.name);
    }

    private async getCalendar(name: string, user: UserDTO, message: Message): Promise<CalendarDTO> {
        let calendar: CalendarDTO = null;
        // Check for existing calendar.
        if (name != null && user.defaultWorldId != null) {
            let calendars = await this.calendarController.getByName(name, user.defaultWorldId);
            if (calendars != null && calendars.length > 0) {
                let tempCalendar: CalendarDTO = {dtoType: DTOType.CALENDAR};
                tempCalendar.name = "No, create a new calendar";
                calendars.push(tempCalendar);

                calendar = await this.calendarController.calendarSelection(calendars, "modify", message);
            }

            if (calendar == null || !calendar.id) {
                calendar = null;
            } else {
                calendar = await this.calendarController.getById(calendar.id);
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
        if (user.defaultWorldId == null) {
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
        calendar.worldId = user.defaultWorldId;
        calendar.epoch = {dtoType: DTOType.DATE};
        calendar.epoch.day = 0;
        calendar.epoch.month = 0;
        calendar.epoch.year = 0;
        calendar.yearLength = 0;

        // TODO: Should be "Create"
        calendar = await this.calendarController.save(calendar);

        if (!calendar) {
            await message.channel.send("Something went wrong while saving...");
            return Promise.resolve(null);
        }

        // Setup basics.
        calendar.week = [];
        calendar.months = [];
        calendar.moons = [];

        return Promise.resolve(calendar);
    }

    private static processWeekDays(daysPerWeek: number, weekdays: string[], calendar: CalendarDTO): CalendarWeekDayDTO[] {
        if (!weekdays) {
            return null;
        }

        // Delete the old week days.
        calendar.week = [];

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
            week.push(day);
        }

        return week;
    }
}