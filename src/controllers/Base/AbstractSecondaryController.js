"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractSecondaryController = void 0;
const AbstractController_1 = require("./AbstractController");
const typeorm_1 = require("typeorm");
class AbstractSecondaryController extends AbstractController_1.AbstractController {
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
}
exports.AbstractSecondaryController = AbstractSecondaryController;
//# sourceMappingURL=AbstractSecondaryController.js.map