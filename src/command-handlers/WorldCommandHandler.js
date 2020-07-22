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
exports.WorldCommandHandler = void 0;
const AbstractUserCommandHandler_1 = require("./base/AbstractUserCommandHandler");
const inversify_1 = require("inversify");
const Subcommands_1 = require("../documentation/commands/Subcommands");
const World_1 = require("../entity/World");
const WorldController_1 = require("../controllers/WorldController");
const types_1 = require("../types");
const UserController_1 = require("../controllers/UserController");
const WorldRelatedClientResponses_1 = require("../documentation/client-responses/WorldRelatedClientResponses");
const PartyController_1 = require("../controllers/PartyController");
let WorldCommandHandler = class WorldCommandHandler extends AbstractUserCommandHandler_1.AbstractUserCommandHandler {
    constructor(partyController, userController, worldController) {
        super();
        this.partyController = partyController;
        this.userController = userController;
        this.worldController = worldController;
    }
    /**
     * Handles the given user command.
     *
     * @param command
     * @param message
     * @param user
     */
    handleUserCommand(command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            // Command to create a new world.
            const createCmd = Subcommands_1.Subcommands.CREATE.isCommand(command);
            if (createCmd != null) {
                return this.createWorld(createCmd.getInput(), command, message, user);
            }
            // Command to switch default worlds.
            const switchCmd = Subcommands_1.Subcommands.SWITCH.isCommand(command);
            if (switchCmd != null) {
                // If the input is null, it means we should remove the default world.
                if (switchCmd.getInput() == null) {
                    return this.removeDefaultWorld(message, user);
                }
                return this.switchDefaultWorld(switchCmd.getInput(), message, user);
            }
            // Command to add the party to this world.
            const ptCmd = Subcommands_1.Subcommands.PARTY.isCommand(command);
            if (ptCmd != null) {
                this.addPartyToWorld(ptCmd.getInput(), message, user);
            }
            return undefined;
        });
    }
    addPartyToWorld(partyName, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let worlds = [];
            if (user.defaultWorld != null) {
                worlds.push(user.defaultWorld);
            }
            if (user.defaultCharacter != null && user.defaultCharacter.party != null && user.defaultCharacter.party.world != null) {
                worlds.push(user.defaultCharacter.party.world);
            }
            if (worlds.length < 1) {
                return message.channel.send("No world to choose from!");
            }
            // No selection needed.
            if (worlds.length == 1) {
                return this.continueAddingPartyToWorld(partyName, message, worlds[0]);
            }
            // Otherwise allow selection.
            return this.worldSelection(worlds, message).then((world) => {
                if (world == null) {
                    return null;
                }
                return this.continueAddingPartyToWorld(partyName, message, world);
            });
        });
    }
    continueAddingPartyToWorld(partyName, message, world) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.partyController.getByNameAndGuild(partyName, message.guild.id).then((parties) => {
                if (parties == null || parties.length < 1) {
                    return message.channel.send("Could not find party with given name like: " + partyName);
                }
                // TODO: Allow user to select party if ambiguous.
                return this.partyController.updatePartyWorld(parties[0], world).then((party) => {
                    return message.channel.send(`Party ('${party.name}') added to world: ${world.name}`);
                });
            });
        });
    }
    switchDefaultWorld(worldName, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findWorldByName(worldName, user).then((worlds) => {
                if (worlds == null || worlds.length < 1) {
                    return message.channel.send("Could not find world with given name like: " + worldName);
                }
                // Only one result.
                if (worlds.length == 1) {
                    return this.userController.updateDefaultWorld(user, worlds[0]).then(() => {
                        return message.channel.send(`Default world switched to '${worlds[0].name}'`);
                    });
                }
                return this.worldSelection(worlds, message).then((world) => {
                    if (world == null) {
                        return null;
                    }
                    return this.userController.updateDefaultWorld(user, world).then(() => {
                        return message.channel.send(`Default world switched to '${world.name}'`);
                    });
                });
            });
        });
    }
    worldSelection(worlds, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return message.channel.send(WorldRelatedClientResponses_1.WorldRelatedClientResponses.SELECT_WORLD(worlds, "switch")).then((msg) => {
                return message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    time: 10e3,
                    errors: ['time'],
                }).then((input) => {
                    msg.delete({ reason: "Removed world processing command." });
                    let content = input.first().content;
                    let choice = Number(content);
                    if (isNaN(choice) || choice >= worlds.length || choice < 0) {
                        message.channel.send("Input doesn't make sense!");
                        return null;
                    }
                    input.first().delete();
                    return worlds[choice];
                }).catch(() => {
                    msg.delete({ reason: "Removed world processing command." });
                    message.channel.send("Message timed out.");
                    return null;
                });
            });
        });
    }
    findWorldByName(worldName, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.worldController.getByNameAndUser(worldName, user);
        });
    }
    removeDefaultWorld(message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userController.updateDefaultWorld(user, null).then((usr) => {
                if (usr == null) {
                    return message.channel.send("Could not remove default world.");
                }
                return message.channel.send("Removed default world.");
            });
        });
    }
    createWorld(worldName, command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const world = new World_1.World();
            world.name = worldName;
            world.guildId = message.guild.id;
            return this.worldController.create(world).then((newWorld) => {
                if (newWorld == null) {
                    return message.channel.send("Could not create world.");
                }
                return this.userController.addWorld(user, newWorld).then((user) => {
                    if (user == null) {
                        return message.channel.send("Could not add the world to the map.");
                    }
                    // Go and save this.
                    return this.userController.updateDefaultWorld(user, newWorld).then(() => {
                        return message.channel.send("Created new world: " + newWorld.name);
                    });
                });
            });
        });
    }
};
WorldCommandHandler = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.PartyController)),
    __param(1, inversify_1.inject(types_1.TYPES.UserController)),
    __param(2, inversify_1.inject(types_1.TYPES.WorldController)),
    __metadata("design:paramtypes", [PartyController_1.PartyController,
        UserController_1.UserController,
        WorldController_1.WorldController])
], WorldCommandHandler);
exports.WorldCommandHandler = WorldCommandHandler;
//# sourceMappingURL=WorldCommandHandler.js.map