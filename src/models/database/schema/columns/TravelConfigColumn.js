"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravelConfigColumn = void 0;
const AbstractColumn_1 = require("./AbstractColumn");
const Column_1 = require("../../../../documentation/databases/Column");
class TravelConfigColumn extends AbstractColumn_1.AbstractColumn {
    constructor() {
        super(Column_1.Column.TRAVEL_CONFIG, "json");
    }
}
exports.TravelConfigColumn = TravelConfigColumn;
//# sourceMappingURL=TravelConfigColumn.js.map