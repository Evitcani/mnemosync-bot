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
exports.UserController = void 0;
const AbstractController_1 = require("./Base/AbstractController");
const User_1 = require("../entity/User");
const Table_1 = require("../documentation/databases/Table");
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
let UserController = class UserController extends AbstractController_1.AbstractController {
    /**
     * Construct this controller.
     */
    constructor() {
        super(Table_1.Table.USER);
    }
    /**
     * Creates a new user.
     *
     * @param discordId The discord ID of the user.
     * @param discordName The discord name of user.
     */
    create(discordId, discordName) {
        return __awaiter(this, void 0, void 0, function* () {
            const tempUser = new User_1.User();
            tempUser.discord_id = discordId;
            tempUser.discord_name = discordName;
            return this.getRepo().save(tempUser).catch((err) => {
                console.error("ERR ::: Could not create new user.");
                console.error(err);
                return null;
            });
        });
    }
    /**
     * Gets the user.
     *
     * @param discordId The discord ID of the user.
     * @param discordName The discord name of user.
     */
    get(discordId, discordName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getRepo().findOne({ where: { discord_id: discordId }, relations: ["defaultCharacter"] })
                .then((user) => {
                if (!user) {
                    return this.create(discordId, discordName);
                }
                // Update the name, if needed.
                if (user.discord_name != discordName) {
                    user.discord_name = discordName;
                    return this.save(user);
                }
                return user;
            }).catch((err) => {
                console.error("ERR ::: Could not get the user.");
                console.error(err);
                return null;
            });
        });
    }
    /**
     * Updates the default character.
     *
     * @param user The user to update.
     * @param character The new character to make default.
     */
    updateDefaultCharacter(user, character) {
        return __awaiter(this, void 0, void 0, function* () {
            user.defaultCharacter = character;
            user.defaultCharacterId = character.id;
            return this.save(user);
        });
    }
    /**
     * Updates the default characters.
     *
     * @param user The user to update.
     * @param world The new character to make default.
     */
    updateDefaultWorld(user, world) {
        return __awaiter(this, void 0, void 0, function* () {
            if (world != null) {
                user.defaultWorld = world;
            }
            else {
                user.defaultWorld = null;
            }
            return this.save(user);
        });
    }
    addWorld(user, world) {
        return __awaiter(this, void 0, void 0, function* () {
            return typeorm_1.getConnection()
                .createQueryBuilder()
                .relation(User_1.User, "campaignsDMing")
                .of(user)
                .add(world).then(() => {
                return user;
            }).catch((err) => {
                console.error("ERR ::: Could not add new world.");
                console.error(err);
                return null;
            });
        });
    }
    /**
     * Saves the user.
     *
     * @param user The user to save.
     */
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getRepo().save(user).catch((err) => {
                console.error("ERR ::: Could not save the user.");
                console.error(err);
                return null;
            });
        });
    }
};
UserController = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map