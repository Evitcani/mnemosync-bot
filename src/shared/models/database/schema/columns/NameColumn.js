"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameColumn = void 0;
const AbstractColumn_1 = require("./AbstractColumn");
const Column_1 = require("../../../../documentation/databases/Column");
class NameColumn extends AbstractColumn_1.AbstractColumn {
    constructor() {
        super(Column_1.Column.NAME, "string");
    }
}
exports.NameColumn = NameColumn;
//# sourceMappingURL=NameColumn.js.map