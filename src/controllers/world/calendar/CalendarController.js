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
exports.CalendarController = void 0;
const AbstractController_1 = require("../../Base/AbstractController");
const Table_1 = require("../../../documentation/databases/Table");
const inversify_1 = require("inversify");
const NameValuePair_1 = require("../../Base/NameValuePair");
const CalendarRelatedResponses_1 = require("../../../documentation/client-responses/information/CalendarRelatedResponses");
let CalendarController = class CalendarController extends AbstractController_1.AbstractController {
    constructor() {
        super(Table_1.Table.CALENDAR);
    }
    save(calendar) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getRepo().save(calendar);
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getRepo().findOne({
                where: { id: id },
                relations: ["eras", "months", "moons", "week"]
            })
                .catch((err) => {
                console.error("ERR ::: Could not get calendars with given id.");
                console.error(err);
                return null;
            });
        });
    }
    /**
     * Gets the calendar by name.
     *
     * @param calendarName The name of the calendar to find.
     * @param worldId The ID of the world the  calendar exists in.
     */
    getByName(calendarName, worldId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getLikeArgs([new NameValuePair_1.NameValuePair("world_id", worldId)], [new NameValuePair_1.NameValuePair("name", calendarName)])
                .catch((err) => {
                console.error("ERR ::: Could not get calendars with given name.");
                console.error(err);
                return null;
            });
        });
    }
    calendarSelection(calendars, action, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return message.channel.send(CalendarRelatedResponses_1.CalendarRelatedResponses.SELECT_CALENDAR(calendars, action)).then((msg) => {
                return message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    time: 10e3,
                    errors: ['time'],
                }).then((input) => {
                    msg.delete({ reason: "Removed calendar processing command." });
                    let content = input.first().content;
                    let choice = Number(content);
                    if (isNaN(choice) || choice >= calendars.length || choice < 0) {
                        message.channel.send("Input doesn't make sense!");
                        return null;
                    }
                    input.first().delete();
                    return calendars[choice];
                }).catch(() => {
                    msg.delete({ reason: "Removed calendar processing command." });
                    message.channel.send("Message timed out.");
                    return null;
                });
            });
        });
    }
};
CalendarController = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], CalendarController);
exports.CalendarController = CalendarController;
//# sourceMappingURL=CalendarController.js.map