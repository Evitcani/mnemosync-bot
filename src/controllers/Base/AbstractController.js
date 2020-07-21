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
exports.AbstractController = void 0;
const typeorm_1 = require("typeorm");
const StringUtility_1 = require("../../utilities/StringUtility");
const inversify_1 = require("inversify");
let AbstractController = class AbstractController {
    constructor(tableName) {
        this.tableName = tableName;
    }
    /**
     * Gets the repo.
     */
    getRepo() {
        return typeorm_1.getManager().getRepository(this.tableName);
    }
    /**
     * Processes like arguments which can be tricky.
     *
     * @param whereArgs
     * @param likeArgs
     */
    getLikeArgs(whereArgs, likeArgs) {
        let query = this.getRepo().createQueryBuilder(this.tableName);
        query = this.createLikeQuery(whereArgs, likeArgs, query);
        return query.getMany()
            .then((objs) => {
            if (objs == null || objs.length < 1) {
                return null;
            }
            return objs;
        });
    }
    /**
     * Fills the query with appropriate where clauses.
     * @param whereArgs
     * @param likeArgs
     * @param query
     */
    createLikeQuery(whereArgs, likeArgs, query) {
        let oneClause = false, i, whereQuery, pair, sanitizedValue;
        if (whereArgs != null && whereArgs.length > 0) {
            for (i = 0; i < whereArgs.length; i++) {
                pair = whereArgs[i];
                sanitizedValue = StringUtility_1.StringUtility.escapeMySQLInput(pair.value);
                whereQuery = `\"${this.tableName}\".\"${pair.name}\" = ${sanitizedValue}`;
                if (!oneClause) {
                    query = query.where(whereQuery);
                    oneClause = true;
                }
                else {
                    query = query.andWhere(whereQuery);
                }
            }
        }
        if (likeArgs != null && likeArgs.length > 0) {
            for (i = 0; i < likeArgs.length; i++) {
                pair = likeArgs[i];
                sanitizedValue = StringUtility_1.StringUtility.escapeSQLInput(pair.value);
                whereQuery = `LOWER(\"${this.tableName}\".\"${pair.name}\") LIKE LOWER('%${sanitizedValue}%')`;
                if (!oneClause) {
                    query = query.where(whereQuery);
                    oneClause = true;
                }
                else {
                    query = query.andWhere(whereQuery);
                }
            }
        }
        return query;
    }
};
AbstractController = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [String])
], AbstractController);
exports.AbstractController = AbstractController;
//# sourceMappingURL=AbstractController.js.map