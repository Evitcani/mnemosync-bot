"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartiesTable = void 0;
const AbstractTable_1 = require("./AbstractTable");
const IdColumn_1 = require("./columns/IdColumn");
const NameColumn_1 = require("./columns/NameColumn");
const Table_1 = require("../../../documentation/databases/Table");
class PartiesTable extends AbstractTable_1.AbstractTable {
    constructor() {
        super(Table_1.Table.PARTY, [new IdColumn_1.IdColumn(), new NameColumn_1.NameColumn()]);
    }
}
exports.PartiesTable = PartiesTable;
//# sourceMappingURL=PartiesTable.js.map