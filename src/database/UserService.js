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
exports.UserService = void 0;
const DatabaseService_1 = require("./base/DatabaseService");
const inversify_1 = require("inversify");
const types_1 = require("../types");
const User_1 = require("../entity/User");
const typeorm_1 = require("typeorm");
let UserService = class UserService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    getRepo() {
        return typeorm_1.getManager().getRepository(User_1.User);
    }
    getUser(discordId, discordName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getRepo().findOne({ where: { discord_id: discordId } }).then((user) => {
                if (!user) {
                    return this.addUser(discordId, discordName);
                }
                if (discordName != user.discord_name) {
                    user.discord_name = discordName;
                    return this.updateUser(user).then(() => {
                        return user;
                    });
                }
                return user;
            }).catch((err) => {
                console.log(`ERROR: Could not get user (ID: ${discordId}). ::: ${err.message}`);
                console.log(err.stack);
                return null;
            });
        });
    }
    /**
     * Registers a party to a given guild.
     *
     * @param discordId The ID of the user to register.
     * @param discordName The current discord name of the user to register.
     */
    addUser(discordId, discordName) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create the user.
            const user = new User_1.User();
            user.discord_id = discordId;
            user.discord_name = discordName;
            // Save the user.
            return this.getRepo().save(user).then((user) => {
                return user;
            }).catch((err) => {
                console.log(`ERROR: Could add new user (Discord ID: ${discordId}). ::: ${err.message}`);
                console.log(err.stack);
                return null;
            });
        });
    }
    updateDefaultCharacter(discordId, discordName, character) {
        return this.getUser(discordId, discordName).then((user) => {
            user.defaultCharacter = character;
            return this.updateUser(user);
        });
    }
    /**
     * Updates the default character and gets the updated user.
     *
     * @param user
     */
    updateUser(user) {
        return this.getRepo().save(user).then((user) => {
            return user;
        });
    }
};
UserService.TABLE_NAME = "users";
UserService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.DatabaseService)),
    __metadata("design:paramtypes", [DatabaseService_1.DatabaseService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map