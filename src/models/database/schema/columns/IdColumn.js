"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdColumn = void 0;
const AbstractColumn_1 = require("./AbstractColumn");
const Column_1 = require("../../../../documentation/databases/Column");
class IdColumn extends AbstractColumn_1.AbstractColumn {
    constructor() {
        super(Column_1.Column.ID, "number");
    }
}
exports.IdColumn = IdColumn;
//# sourceMappingURL=IdColumn.js.map