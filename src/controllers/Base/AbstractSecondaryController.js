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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractSecondaryController = void 0;
const AbstractController_1 = require("./AbstractController");
const typeorm_1 = require("typeorm");
const inversify_1 = require("inversify");
let AbstractSecondaryController = class AbstractSecondaryController extends AbstractController_1.AbstractController {
    constructor(primaryTableName, secondaryTableName) {
        super(primaryTableName);
        this.secondaryTableName = secondaryTableName;
    }
    /**
     * Gets the repo.
     */
    getSecondaryRepo() {
        return typeorm_1.getManager().getRepository(this.secondaryTableName);
    }
    /**
     * Processes like arguments which can be tricky.
     *
     * @param whereArgs
     * @param likeArgs
     */
    getSecondaryLikeArgs(whereArgs, likeArgs) {
        let query = this.getSecondaryRepo().createQueryBuilder(this.secondaryTableName);
        query = this.createLikeQuery(whereArgs, likeArgs, query);
        return query.getMany()
            .then((objs) => {
            if (objs == null || objs.length < 1) {
                return null;
            }
            return objs;
        });
    }
};
AbstractSecondaryController = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [String, String])
], AbstractSecondaryController);
exports.AbstractSecondaryController = AbstractSecondaryController;
//# sourceMappingURL=AbstractSecondaryController.js.map