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
exports.DateCommandHandler = void 0;
const AbstractUserCommandHandler_1 = require("../../base/AbstractUserCommandHandler");
const inversify_1 = require("inversify");
const types_1 = require("../../../types");
const PartyController_1 = require("../../../controllers/party/PartyController");
const CalendarController_1 = require("../../../controllers/world/calendar/CalendarController");
const CurrentDateController_1 = require("../../../controllers/world/calendar/CurrentDateController");
const Subcommands_1 = require("../../../documentation/commands/Subcommands");
const CurrentDate_1 = require("../../../entity/CurrentDate");
const GameDate_1 = require("../../../entity/GameDate");
const MessageUtility_1 = require("../../../utilities/MessageUtility");
const CalendarRelatedResponses_1 = require("../../../documentation/client-responses/information/CalendarRelatedResponses");
let DateCommandHandler = class DateCommandHandler extends AbstractUserCommandHandler_1.AbstractUserCommandHandler {
    constructor(calendarController, currentDateController, partyController) {
        super();
        this.calendarController = calendarController;
        this.currentDateController = currentDateController;
        this.partyController = partyController;
    }
    handleUserCommand(command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the party first. Needed for all subcommands.
            let party = yield this.getParty(command, message, user);
            if (party == null) {
                return message.channel.send("Requires a party in a world to assign the date to.");
            }
            // User wants to create.
            if (Subcommands_1.Subcommands.CREATE.isCommand(command)) {
                yield this.handleCreateCommand(command, message, user, party);
            }
            // User wants to set the date.
            if (Subcommands_1.Subcommands.DATE.isCommand(command)) {
                yield this.handleSetDateCommand(command, message, user, party);
            }
            // Just wants the current date.
            if (command.getInput() == null) {
                if (party.currentDate == null) {
                    return message.channel.send("No current date for this party. Needs setup.");
                }
                let embed = yield CalendarRelatedResponses_1.CalendarRelatedResponses.PRINT_DATE(party.currentDate, party, message, this.calendarController);
                if (embed == null) {
                    return message.channel.send("Something is wrong with the date.");
                }
                return message.channel.send(embed);
            }
            return message.channel.send("Finished processing commands.");
        });
    }
    getParty(command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            // First, get the party.
            let party = yield this.partyController.getPartyBasedOnInputOrUser(command, message, user, "add the date to");
            if (party == null || party.world == null) {
                return null;
            }
            return party;
        });
    }
    /**
     * Creates a new current date for the given party.
     *
     * @param command
     * @param message
     * @param user
     * @param party
     */
    handleCreateCommand(command, message, user, party) {
        return __awaiter(this, void 0, void 0, function* () {
            if (party.currentDate != null) {
                return message.channel.send("Already has a current date.");
            }
            // First, we need to go get the calendar.
            let calendarName = Subcommands_1.Subcommands.CREATE.getCommand(command).getInput();
            if (calendarName == null) {
                return message.channel.send("You must provide the name of a calendar for this date.");
            }
            // Get the calendar.
            let calendars = yield this.calendarController.getByName(calendarName, party.world.id);
            // No calendars found.
            if (calendars.length <= 0) {
                return message.channel.send("No calendars exist with that name!");
            }
            // Now choose the calendar if we must.
            let calendar;
            if (calendars.length > 1) {
                calendar = yield this.calendarController.calendarSelection(calendars, "use for the party's default calendar", message);
            }
            else {
                calendar = calendars[0];
            }
            // Assume a timeout.
            if (calendar == null) {
                return null;
            }
            // Create the current date.
            let currentDate = new CurrentDate_1.CurrentDate();
            currentDate.calendar = calendar;
            currentDate.party = party;
            currentDate.date = new GameDate_1.GameDate();
            currentDate.date.calendarId = calendar.id;
            // Save this.
            currentDate = yield this.currentDateController.save(currentDate);
            // Save the party.
            party.currentDate = currentDate;
            yield this.partyController.save(party);
            return message.channel.send("Saved new date to the party.");
        });
    }
    /**
     * Handles the command to set the date to a specific date.
     *
     * @param command
     * @param message
     * @param user
     * @param party
     */
    handleSetDateCommand(command, message, user, party) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Only GMs can change the date.
            // Can't process without a current date.
            if (party.currentDate == null) {
                return message.channel.send("No current date assigned to the party. Must create one first.");
            }
            // Easy access variable.
            let currentDate = party.currentDate;
            currentDate.date = yield MessageUtility_1.MessageUtility.processDateCommand(command, message);
            currentDate.date.calendarId = currentDate.calendarId;
            // Save this.
            currentDate = yield this.currentDateController.save(currentDate);
            // Now get the date.
            let date = yield MessageUtility_1.MessageUtility.getProperDate(currentDate.date, message, null, this.calendarController);
            if (date == null) {
                return null;
            }
            return message.channel.send(`Date changed! Set date to the ${date}.`);
        });
    }
};
DateCommandHandler = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.CalendarController)),
    __param(1, inversify_1.inject(types_1.TYPES.CurrentDateController)),
    __param(2, inversify_1.inject(types_1.TYPES.PartyController)),
    __metadata("design:paramtypes", [CalendarController_1.CalendarController,
        CurrentDateController_1.CurrentDateController,
        PartyController_1.PartyController])
], DateCommandHandler);
exports.DateCommandHandler = DateCommandHandler;
//# sourceMappingURL=DateCommandHandler.js.map