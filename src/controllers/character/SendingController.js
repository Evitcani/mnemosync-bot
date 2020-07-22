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
var SendingController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendingController = void 0;
const inversify_1 = require("inversify");
const AbstractController_1 = require("../Base/AbstractController");
const Sending_1 = require("../../entity/Sending");
const Table_1 = require("../../documentation/databases/Table");
const typeorm_1 = require("typeorm");
let SendingController = SendingController_1 = class SendingController extends AbstractController_1.AbstractController {
    constructor() {
        super(Table_1.Table.SENDING);
    }
    /**
     * Creates a new sending.
     *
     * @param sending
     */
    create(sending) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getRepo().save(sending)
                .catch((err) => {
                console.error("ERR ::: Could not create new sending.");
                console.error(err);
                return null;
            });
        });
    }
    getByIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            // Not a valid argument.
            if (ids == null || ids.length < 1) {
                return null;
            }
            return this.getRepo().find({ where: { id: ids }, relations: ["toNpc", "fromNpc", "toPlayer", "fromPlayer"] })
                .then((sending) => {
                // Check the party is valid.
                return sending;
            })
                .catch((err) => {
                console.error("ERR ::: Could not get sendings.");
                console.error(err);
                return null;
            });
        });
    }
    get(page, world, toNpc, toPlayer) {
        return __awaiter(this, void 0, void 0, function* () {
            let flag = false, sub;
            let query = typeorm_1.getConnection().createQueryBuilder(Sending_1.Sending, "msg");
            if (world != null) {
                query = query.where(`"msg"."world_id" = '${world.id}'`);
                flag = true;
            }
            if (toNpc != null) {
                sub = `"msg"."to_npc_id" = '${toNpc.id}'`;
                if (flag) {
                    query = query.andWhere(sub);
                }
                else {
                    query = query.where(sub);
                }
                flag = true;
            }
            if (toPlayer != null) {
                sub = `"msg"."to_player_id" = ${toPlayer.id}`;
                if (flag) {
                    query = query.andWhere(sub);
                }
                else {
                    query = query.where(sub);
                }
                flag = true;
            }
            // Nothing to see here.
            if (!flag) {
                console.log("No world, character or NPC provided.");
                return null;
            }
            // Add final touches.
            query = query
                .andWhere(`("msg"."is_replied" IS NULL OR "msg"."is_replied" IS FALSE)`)
                .addSelect(["id"])
                .addOrderBy("\"msg\".\"created_date\"", "ASC")
                .limit(SendingController_1.SENDING_LIMIT)
                .skip(page * SendingController_1.SENDING_LIMIT);
            return query
                .getMany().then((messages) => {
                if (!messages || messages.length < 1) {
                    return null;
                }
                let input = [], i;
                // Put into a map
                for (i = 0; i < messages.length; i++) {
                    input[i] = messages[i].id;
                }
                return this.getByIds(input);
            })
                .catch((err) => {
                console.error("ERR ::: Could not get any sendings.");
                console.error(err);
                return null;
            });
        });
    }
};
SendingController.SENDING_LIMIT = 10;
SendingController = SendingController_1 = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], SendingController);
exports.SendingController = SendingController;
//# sourceMappingURL=SendingController.js.map