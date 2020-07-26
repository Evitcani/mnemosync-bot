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
let DateCommandHandler = class DateCommandHandler extends AbstractUserCommandHandler_1.AbstractUserCommandHandler {
    constructor(calendarController, currentDateController, partyController) {
        super();
        this.calendarController = calendarController;
        this.currentDateController = currentDateController;
        this.partyController = partyController;
    }
    handleUserCommand(command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Subcommands_1.Subcommands.CREATE.isCommand(command)) {
            }
            return undefined;
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