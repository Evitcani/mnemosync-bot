import {Command} from "../../../models/generic/Command";
import {Message} from "discord.js";
import {AbstractUserCommandHandler} from "../../base/AbstractUserCommandHandler";
import {inject, injectable} from "inversify";
import {User} from "../../../entity/User";
import {Subcommands} from "../../../documentation/commands/Subcommands";
import {Calendar} from "../../../entity/Calendar";
import {DonjonCalendar} from "../../../models/generic/DonjonCalendar";
import {GameDate} from "../../../entity/GameDate";
import {CalendarWeekDay} from "../../../entity/CalendarWeekDay";
import {TYPES} from "../../../types";
import {CalendarController} from "../../../controllers/world/calendar/CalendarController";
import {CalendarEraController} from "../../../controllers/world/calendar/CalendarEraController";
import {CalendarMonthController} from "../../../controllers/world/calendar/CalendarMonthController";
import {CalendarMoonController} from "../../../controllers/world/calendar/CalendarMoonController";
import {CalendarWeekDayController} from "../../../controllers/world/calendar/CalendarWeekDayController";
import {CalendarMonth} from "../../../entity/CalendarMonth";
import {CalendarMoon} from "../../../entity/CalendarMoon";

@injectable()
export class CalendarCommandHandler extends AbstractUserCommandHandler {
    private calendarController: CalendarController;
    private eraController: CalendarEraController;
    private monthController: CalendarMonthController;
    private moonController: CalendarMoonController;
    private weekDayController: CalendarWeekDayController;

    constructor(@inject(TYPES.CalendarController) calendarController: CalendarController,
                @inject(TYPES.CalendarEraController) calendarEraController: CalendarEraController,
                @inject(TYPES.CalendarMonthController) calendarMonthController: CalendarMonthController,
                @inject(TYPES.CalendarMoonController) calendarMoonController: CalendarMoonController,
                @inject(TYPES.CalendarWeekDayController) calendarWeekDayController: CalendarWeekDayController) {
        super();
        this.calendarController = calendarController;
        this.eraController = calendarEraController;
        this.monthController = calendarMonthController;
        this.moonController = calendarMoonController;
        this.weekDayController = calendarWeekDayController;
    }

    async handleUserCommand(command: Command, message: Message, user: User): Promise<Message | Message[]> {
        if (Subcommands.DONJON.isCommand(command)) {
            return this.createNewDonjonCalendar(command, message, user);
        }

        return undefined;
    }

    private async createNewDonjonCalendar(command: Command, message: Message, user: User): Promise<Message | Message[]> {
        // Return if no default world.
        if (user.defaultWorld == null) {
            return message.channel.send("No default world, could not save calendar.");
        }

        let json: DonjonCalendar = null;
        if (Subcommands.DONJON.isCommand(command)) {
            let cmd = Subcommands.DONJON.getCommand(command);
            json = JSON.parse(cmd.getInput());
        }

        if (json == null) {
            return message.channel.send("No JSON given, could not continue.");
        }

        let name = null;
        let calendar = new Calendar();
        if (Subcommands.NAME.isCommand(command)) {
            let cmd = Subcommands.NAME.getCommand(command);
            name = cmd.getInput();

            // TODO: Check for existing calendar.
        }

        if (name == null) {
            return message.channel.send("No name given, could not continue.");
        }

        // Start parsing the arguments.
        calendar.name = name;
        calendar.world = user.defaultWorld;
        calendar.epoch = new GameDate();
        calendar.epoch.day = 0;
        calendar.epoch.month = 0;
        calendar.epoch.year = 0;

        // Okay, now we need to save this calendar.
        calendar = await this.calendarController.save(calendar);

        // Setup basics.
        calendar.week = [];
        calendar.months = [];
        calendar.moons = [];

        // Now begin processing the weeks.
        let i, day: CalendarWeekDay;
        for (i = 0; i < json.week_len; i++) {
            day = new CalendarWeekDay();
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
            day = await this.weekDayController.save(day);
            calendar.week.push(day);
        }

        // Now process the months.
        let month: CalendarMonth, month_len: number, yearLength = 0;
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

        // Now process the moons.
        let moon: CalendarMoon, moon_cyc: number, moon_shf: number;
        for (i = 0; i < json.n_moons; i++) {
            moon = new CalendarMoon();
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
        }

        // Set the length of the year.
        calendar.yearLength = yearLength;

        // Now save again.
        calendar = await this.calendarController.save(calendar);

        return message.channel.send("Saved calendar: " + calendar.name);
    }
}