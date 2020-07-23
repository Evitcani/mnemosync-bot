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
exports.NPCController = void 0;
const AbstractController_1 = require("../Base/AbstractController");
const Table_1 = require("../../documentation/databases/Table");
const inversify_1 = require("inversify");
const NameValuePair_1 = require("../Base/NameValuePair");
let NPCController = class NPCController extends AbstractController_1.AbstractController {
    /**
     * Constructs this controller.
     */
    constructor() {
        super(Table_1.Table.NPC);
    }
    /**
     * Creates a new NPC.
     *
     * @param npc The NPC to create.
     */
    create(npc) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getRepo().save(npc)
                .catch((err) => {
                console.error("ERR ::: Could not create new NPC.");
                console.error(err);
                return null;
            });
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getRepo().findOne({ where: { id: id }, relations: ["world"] })
                .catch((err) => {
                console.error("ERR ::: Could not get NPCs by id.");
                console.error(err);
                return null;
            });
        });
    }
    getByWorld(worldId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getRepo()
                .createQueryBuilder("npc")
                .where("\"npc\".\"world_id\" = :id", { id: worldId })
                .orderBy("\"npc\".\"name\"", "ASC")
                .loadAllRelationIds({ relations: ["world"] })
                .getMany()
                .catch((err) => {
                console.error("ERR ::: Could not get NPCs in world.");
                console.error(err);
                return null;
            });
        });
    }
    getByName(name, worldId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getLikeArgs([new NameValuePair_1.NameValuePair("world_id", worldId)], [new NameValuePair_1.NameValuePair("name", name)])
                .then((characters) => {
                if (characters == null || characters.length < 1) {
                    return null;
                }
                return characters[0];
            })
                .catch((err) => {
                console.error("ERR ::: Could not get NPC by name.");
                console.error(err);
                return null;
            });
        });
    }
};
NPCController = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], NPCController);
exports.NPCController = NPCController;
//# sourceMappingURL=NPCController.js.map