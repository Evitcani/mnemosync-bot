"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.TravelCommandHandler = void 0;
const AbstractUserCommandHandler_1 = require("../../base/AbstractUserCommandHandler");
const inversify_1 = require("inversify");
/**
 * The "travel" command is used to calculate the most efficient gear to travel with over a period of days.
 */
let TravelCommandHandler = class TravelCommandHandler extends AbstractUserCommandHandler_1.AbstractUserCommandHandler {
    handleUserCommand(command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    /**
     * Gets all party members in the given party.
     *
     * @param partyId The party ID to fetch all the members of.
     */
    getPartyMembers(partyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
};
TravelCommandHandler = __decorate([
    inversify_1.injectable()
], TravelCommandHandler);
exports.TravelCommandHandler = TravelCommandHandler;
//# sourceMappingURL=TravelCommandHandler.js.map