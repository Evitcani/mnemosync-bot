import {Command} from "../../../../shared/models/generic/Command";
import {Message} from "discord.js";
import {AbstractUserCommandHandler} from "../../base/AbstractUserCommandHandler";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../../types";
import {PartyController} from "../../../../backend/controllers/party/PartyController";
import {CalendarController} from "../../../../backend/controllers/world/CalendarController";
import {CurrentDateController} from "../../../../backend/controllers/world/CurrentDateController";
import {Subcommands} from "../../../../shared/documentation/commands/Subcommands";
import {MessageUtility} from "../../../../backend/utilities/MessageUtility";
import {CalendarRelatedResponses} from "../../../../shared/documentation/client-responses/information/CalendarRelatedResponses";
import {UserDTO} from "../../../../backend/api/dto/model/UserDTO";
import {PartyDTO} from "../../../../backend/api/dto/model/PartyDTO";
import {CurrentDateDTO} from "../../../../backend/api/dto/model/CurrentDateDTO";
import {CalendarDTO} from "../../../../backend/api/dto/model/calendar/CalendarDTO";
import {DTOType} from "../../../../backend/api/dto/DTOType";

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

    async handleUserCommand(command: Command, message: Message, user: UserDTO): Promise<Message | Message[]> {
        // Get the party first. Needed for all subcommands.
        let party: PartyDTO = await this.getParty(command, message, user);
        if (party == null) {
            return message.channel.send("Requires a party in a world to assign the date to.");
        }

        // User wants to create.
        if (Subcommands.CREATE.isCommand(command)) {
            await this.handleCreateCommand(command, message, user, party);
        }

        if (party.currentDateId == null) {
            return message.channel.send("No current date for this party. Needs setup.");
        }

        let currentDate = await this.currentDateController.getById(party.currentDateId);

        // User wants to set the date.
        if (Subcommands.DATE.isCommand(command)) {
            await this.handleSetDateCommand(command, message, user, party, currentDate);
        }

        // Just wants the current date.
        if (command.getInput() == null) {


            let embed = await CalendarRelatedResponses.PRINT_DATE(currentDate, party, message, currentDate.calendar);

            if (embed == null) {
                return message.channel.send("Something is wrong with the date.");
            }

            return message.channel.send(embed);
        }

        return message.channel.send("Finished processing commands.");
    }

    private async getParty(command: Command, message: Message, user: UserDTO): Promise<PartyDTO> {
        // First, get the party.
        let party = await this.partyController.getPartyBasedOnInputOrUser(command, message, user,
            "add the date to");

        if (party == null || party.worldId == null) {
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
    private async handleCreateCommand(command: Command, message: Message,
                                      user: UserDTO, party: PartyDTO): Promise<Message | Message[]> {
        if (party.currentDateId != null) {
            return message.channel.send("Already has a current date.");
        }

        // First, we need to go get the calendar.
        let calendarName = Subcommands.CREATE.getCommand(command).getInput();
        if (calendarName == null) {
            return message.channel.send("You must provide the name of a calendar for this date.");
        }

        // Get the calendar.
        let calendars = await this.calendarController.getByName(calendarName, party.worldId);

        // No calendars found.
        if (calendars.length <= 0) {
            return message.channel.send("No calendars exist with that name!");
        }

        // Now choose the calendar if we must.
        let calendar: CalendarDTO;
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
        let currentDate: CurrentDateDTO = {dtoType: DTOType.CURRENT_DATE};
        currentDate.calendar = {dtoType: DTOType.CALENDAR};
        currentDate.calendar.id = calendar.id;
        currentDate.date = {dtoType: DTOType.DATE};
        currentDate.date.calendarId = calendar.id;

        // Save this.
        currentDate = await this.currentDateController.save(currentDate);

        // Save the party.
        party.currentDateId = currentDate.id;
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
     * @param currentDate
     */
    private async handleSetDateCommand(command: Command, message: Message, user: UserDTO,
                                       party: PartyDTO, currentDate: CurrentDateDTO): Promise<Message | Message[]> {
        // TODO: Only GMs can change the date.

        // Easy access variable.
        currentDate.date = await MessageUtility.processDateCommand(command, message);
        currentDate.date.calendarId = currentDate.calendar.id;

        // Save this.
        currentDate = await this.currentDateController.save(currentDate);

        // Now get the date.
        let date = await MessageUtility.getProperDate(currentDate.date, message, currentDate.calendar);
        if  (date == null) {
            return null;
        }

        return message.channel.send(`Date changed! Set date to the ${date}.`);
    }
}