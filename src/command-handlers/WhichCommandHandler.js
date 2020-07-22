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
exports.WhichCommandHandler = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const WhichRelatedClientResponses_1 = require("../documentation/client-responses/WhichRelatedClientResponses");
const PartyController_1 = require("../controllers/PartyController");
const AbstractUserCommandHandler_1 = require("./base/AbstractUserCommandHandler");
const NPCController_1 = require("../controllers/NPCController");
const WorldController_1 = require("../controllers/WorldController");
const NPCRelatedClientResponses_1 = require("../documentation/client-responses/NPCRelatedClientResponses");
/**
 * Handles questions about the state of the world.
 */
let WhichCommandHandler = class WhichCommandHandler extends AbstractUserCommandHandler_1.AbstractUserCommandHandler {
    constructor(npcController, partyController, worldController) {
        super();
        this.npcController = npcController;
        this.partyController = partyController;
        this.worldController = worldController;
    }
    handleUserCommand(command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get all NPCs in a given world.
            if (command.getInput() != null && command.getInput().toLowerCase() == "npc") {
                return this.worldController.worldSelectionFromUser(user, message).then((world) => {
                    if (world == null) {
                        return message.channel.send("No world associated with  account.");
                    }
                    return this.npcController.getByWorld(world.id).then((npcs) => {
                        if (npcs == null || npcs.length < 1) {
                            return message.channel.send("No NPCs are in this world.");
                        }
                        npcs.sort((npc1, npc2) => {
                            return npc1.name.localeCompare(npc2.name);
                        });
                        return message.channel.send(NPCRelatedClientResponses_1.NPCRelatedClientResponses.DISPLAY_ALL(npcs, world));
                    });
                });
            }
            return this.partyController.getByGuild(message.guild.id).then((res) => {
                return message.channel.send(WhichRelatedClientResponses_1.WhichRelatedClientResponses.LIST_ALL_PARTIES(res));
            });
        });
    }
};
WhichCommandHandler = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.NPCController)),
    __param(1, inversify_1.inject(types_1.TYPES.PartyController)),
    __param(2, inversify_1.inject(types_1.TYPES.WorldController)),
    __metadata("design:paramtypes", [NPCController_1.NPCController,
        PartyController_1.PartyController,
        WorldController_1.WorldController])
], WhichCommandHandler);
exports.WhichCommandHandler = WhichCommandHandler;
//# sourceMappingURL=WhichCommandHandler.js.map