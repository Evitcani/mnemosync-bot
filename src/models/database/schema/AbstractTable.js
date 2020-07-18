"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractTable = void 0;
class AbstractTable {
    constructor(tableName, columns) {
        this.tableName = tableName;
        this.columns = columns;
    }
    getTableName() {
        return this.tableName;
    }
    getColumns() {
        return this.columns;
    }
}
exports.AbstractTable = AbstractTable;
//# sourceMappingURL=AbstractTable.js.map