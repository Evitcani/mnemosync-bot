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
exports.WorldController = void 0;
const AbstractController_1 = require("../Base/AbstractController");
const Table_1 = require("../../../shared/documentation/databases/Table");
const inversify_1 = require("inversify");
const User_1 = require("../../../entity/User");
const StringUtility_1 = require("../../utilities/StringUtility");
const discord_js_1 = require("discord.js");
const WorldRelatedClientResponses_1 = require("../../../shared/documentation/client-responses/information/WorldRelatedClientResponses");
const typeorm_1 = require("typeorm");
let WorldController = class WorldController extends AbstractController_1.AbstractController {
    /**
     * Constructs this controller.
     */
    constructor() {
        super(Table_1.Table.WORLD);
    }
    /**
     * Creates a new world.
     *
     * @param world The world to create.
     */
    create(world) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getRepo().save(world)
                .catch((err) => {
                console.error("ERR ::: Could not create new world.");
                console.error(err);
                return null;
            });
        });
    }
    worldSelectionFromUser(user, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // If the default world is not null, then add the character on that world.
            let worlds = [];
            if (user.defaultWorld != null) {
                worlds.push(user.defaultWorld);
            }
            if (user.defaultCharacter != null && user.defaultCharacter.party != null && user.defaultCharacter.party.world != null) {
                worlds.push(user.defaultCharacter.party.world);
            }
            if (worlds.length < 1) {
                yield message.channel.send("No world to choose from!");
                return Promise.resolve(null);
            }
            // No selection needed.
            if (worlds.length == 1) {
                return Promise.resolve(worlds[0]);
            }
            return this.worldSelection(worlds, message);
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
    /**
     * Gets all parties in the given guild with a name similar.
     *
     * @param name The name of the world to get.
     * @param user
     */
    getByNameAndUser(name, user) {
        let sanitizedName = StringUtility_1.StringUtility.escapeSQLInput(name);
        return this
            .getRepo()
            .createQueryBuilder("world")
            .leftJoinAndSelect(Table_1.Table.WORLD_OWNERS, "owners", `world.id = "owners"."worldsId"`)
            .where(`"owners"."usersId" = ${user.id}`)
            .andWhere(`LOWER(world.name) LIKE LOWER('%${sanitizedName}%')`)
            .getMany()
            .catch((err) => {
            console.error("ERR ::: Could not get worlds.");
            console.error(err);
            return null;
        });
    }
    /**
     * Gets all parties in the given guild with a name similar.
     *
     * @param id The name of the world to get.
     * @param user
     */
    getDiscordId(id) {
        return typeorm_1.getConnection()
            .createQueryBuilder(User_1.User, "user")
            .leftJoinAndSelect(Table_1.Table.WORLD_OWNERS, "owners", `user.id = "owners"."usersId"`)
            .where(`"owners"."worldsId" = '${id}'`)
            .getMany()
            .then((users) => {
            if (!users || users.length < 1) {
                return null;
            }
            let input = new discord_js_1.Collection(), user, discordId, i;
            for (i = 0; i < users.length; i++) {
                user = users[i];
                discordId = user.discord_id;
                input.set(discordId, discordId);
            }
            return input;
        })
            .catch((err) => {
            console.error("ERR ::: Could not get worlds.");
            console.error(err);
            return null;
        });
    }
    static isWorld(obj) {
        return (obj.type != undefined && obj.type == "World") || typeof obj.id == "string";
    }
};
WorldController = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], WorldController);
exports.WorldController = WorldController;
//# sourceMappingURL=WorldController.js.map