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
const AbstractController_1 = require("./Base/AbstractController");
const World_1 = require("../entity/World");
const Table_1 = require("../documentation/databases/Table");
const inversify_1 = require("inversify");
const StringUtility_1 = require("../utilities/StringUtility");
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
    /**
     * Gets all parties in the given guild with a name similar.
     *
     * @param name The name of the world to get.
     * @param user
     */
    getByNameAndUser(name, user) {
        let sanitizedName = StringUtility_1.StringUtility.escapeSQLInput(name);
        let query = this
            .getRepo()
            .createQueryBuilder(Table_1.Table.WORLD_OWNERS)
            .leftJoinAndSelect(World_1.World, "world", `world.id = "${Table_1.Table.WORLD_OWNERS}"."worldsId"`)
            .where(`"${Table_1.Table.WORLD_OWNERS}"."usersId" = ${user.id}`)
            .andWhere(`LOWER(world.name) LIKE LOWER('%${name}%')`)
            .getQuery();
        console.log("QUERY: " + query);
        return this
            .getRepo()
            .createQueryBuilder("world")
            .leftJoinAndSelect(Table_1.Table.WORLD_OWNERS, "owners", `world.id = "owners"."worldsId"`)
            .where(`"owners"."usersId" = ${user.id}`)
            .andWhere(`LOWER(world.name) LIKE LOWER('%${name}%')`)
            .getMany()
            .catch((err) => {
            console.error("ERR ::: Could not get worlds.");
            console.error(err);
            return null;
        });
    }
};
WorldController = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], WorldController);
exports.WorldController = WorldController;
//# sourceMappingURL=WorldController.js.map