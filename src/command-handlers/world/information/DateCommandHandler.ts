import {Command} from "../../../models/generic/Command";
import {Message} from "discord.js";
import {AbstractUserCommandHandler} from "../../base/AbstractUserCommandHandler";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../types";
import {PartyController} from "../../../controllers/party/PartyController";
import {CalendarController} from "../../../controllers/world/calendar/CalendarController";
import {CurrentDateController} from "../../../controllers/world/calendar/CurrentDateController";
import {Subcommands} from "../../../documentation/commands/Subcommands";
import {User} from "../../../entity/User";
import {Party} from "../../../entity/Party";
import {Calendar} from "../../../entity/Calendar";
import {CurrentDate} from "../../../entity/CurrentDate";
import {GameDate} from "../../../entity/GameDate";
import {MessageUtility} from "../../../utilities/MessageUtility";
import {CalendarRelatedResponses} from "../../../documentation/client-responses/information/CalendarRelatedResponses";

@injectable()
export class DateCommandHandler extends AbstractUserCommandHandler {
    private calendarController: CalendarController;
    private currentDateController: CurrentDateController;
    private partyController: PartyController;

    constructor(@inject(TYPES.CalendarController) calendarController: CalendarController,
                @inject(TYPES.CurrentDateController) currentDateController: CurrentDateController,
                @inject(TYPES.PartyController) partyController: PartyController) {
        super();
        this.calendarController = calendarController;
        this.currentDateController = currentDateController;
        this.partyController = partyController;
    }

    async handleUserCommand(command: Command, message: Message, user: User): Promise<Message | Message[]> {
        // Get the party first. Needed for all subcommands.
        let party: Party = await this.getParty(command, message, user);
        if (party == null) {
            return message.channel.send("Requires a party in a world to assign the date to.");
        }

        // User wants to create.
        if (Subcommands.CREATE.isCommand(command)) {
            await this.handleCreateCommand(command, message, user, party);
        }

        // User wants to set the date.
        if (Subcommands.DATE.isCommand(command)) {
            await this.handleSetDateCommand(command, message, user, party);
        }

        // Just wants the current date.
        if (command.getInput() == null) {
            if (party.currentDate == null) {
                return message.channel.send("No current date for this party. Needs setup.");
            }

            return message.channel.send(CalendarRelatedResponses.PRINT_DATE(party.currentDate, party, message,
                this.calendarController));
        }

        return message.channel.send("Finished processing commands.");
    }

    private async getParty(command: Command, message: Message, user: User): Promise<Party> {
        // First, get the party.
        let party = await this.partyController.getPartyBasedOnInputOrUser(command, message, user,
            "add the date to");

        if (party == null || party.world == null) {
            return null;
        }

        return party;
    }

    /**
     * Creates a new current date for the given party.
     *
     * @param command
     * @param message
     * @param user
     * @param party
     */
    private async handleCreateCommand(command: Command, message: Message, user: User, party: Party): Promise<Message | Message[]> {
        if (party.currentDate != null) {
            return message.channel.send("Already has a current date.");
        }

        // First, we need to go get the calendar.
        let calendarName = Subcommands.CREATE.getCommand(command).getInput();
        if (calendarName == null) {
            return message.channel.send("You must provide the name of a calendar for this date.");
        }

        // Get the calendar.
        let calendars = await this.calendarController.getByName(calendarName, party.world.id);

        // No calendars found.
        if (calendars.length <= 0) {
            return message.channel.send("No calendars exist with that name!");
        }

        // Now choose the calendar if we must.
        let calendar: Calendar;
        if (calendars.length > 1) {
            calendar = await this.calendarController.calendarSelection(calendars, "use for the party's default calendar", message);
        } else {
            calendar = calendars[0];
        }

        // Assume a timeout.
        if (calendar == null) {
            return null;
        }

        // Create the current date.
        let currentDate = new CurrentDate();
        currentDate.calendar = calendar;
        currentDate.party = party;
        currentDate.date = new GameDate();
        currentDate.date.calendarId = calendar.id;

        // Save this.
        currentDate = await this.currentDateController.save(currentDate);

        // Save the party.
        party.currentDate = currentDate;
        await this.partyController.save(party);

        return message.channel.send("Saved new date to the party.");
    }

    /**
     * Handles the command to set the date to a specific date.
     *
     * @param command
     * @param message
     * @param user
     * @param party
     */
    private async handleSetDateCommand(command: Command, message: Message, user: User, party: Party): Promise<Message | Message[]> {
        // TODO: Only GMs can change the date.

        // Can't process without a current date.
        if (party.currentDate == null) {
            return message.channel.send("No current date assigned to the party. Must create one first.");
        }

        // Easy access variable.
        let currentDate = party.currentDate;
        currentDate.date = await MessageUtility.processDateCommand(command, message);
        currentDate.date.calendarId = currentDate.calendarId;

        // Save this.
        currentDate = await this.currentDateController.save(currentDate);

        // Now get the date.
        let date = await MessageUtility.getProperDate(currentDate.date, message, null, this.calendarController);
        if  (date == null) {
            return null;
        }

        return message.channel.send(`Date changed! Set date to the ${date}.`);
    }
}