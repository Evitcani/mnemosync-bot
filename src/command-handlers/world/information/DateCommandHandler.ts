import {Command} from "../../../models/generic/Command";
import {Message} from "discord.js";
import {AbstractUserCommandHandler} from "../../base/AbstractUserCommandHandler";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../types";
import {PartyController} from "../../../controllers/party/PartyController";
import {CalendarController} from "../../../controllers/world/calendar/CalendarController";
import {CurrentDateController} from "../../../controllers/world/calendar/CurrentDateController";
import {Subcommands} from "../../../documentation/commands/Subcommands";

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

    async handleUserCommand(command: Command, message, user): Promise<Message | Message[]> {
        if (Subcommands.CREATE.isCommand(command)) {

        }

        return undefined;
    }
}