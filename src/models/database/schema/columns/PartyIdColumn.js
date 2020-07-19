"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartyIdColumn = void 0;
const AbstractColumn_1 = require("./AbstractColumn");
const Column_1 = require("../../../../documentation/databases/Column");
class PartyIdColumn extends AbstractColumn_1.AbstractColumn {
    constructor() {
        super(Column_1.Column.PARTY_ID, "number");
    }
}
exports.PartyIdColumn = PartyIdColumn;
//# sourceMappingURL=PartyIdColumn.js.map