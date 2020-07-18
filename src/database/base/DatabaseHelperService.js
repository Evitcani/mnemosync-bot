"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseHelperService = void 0;
const PartiesTable_1 = require("../../models/database/schema/PartiesTable");
const StringUtility_1 = require("../../utilities/StringUtility");
class DatabaseHelperService {
    constructor() {
        this.tables = DatabaseHelperService.createTables();
    }
    static doSelectQuery(tableName, whereColumns) {
        return DatabaseHelperService.doBasicSelectQuery(tableName, "*", whereColumns);
    }
    static doSelectQueryWithColumns(tableName, selectColumns, whereColumns) {
        return DatabaseHelperService.doBasicSelectQuery(tableName, DatabaseHelperService.turnToStr(selectColumns, ", "), whereColumns);
    }
    static doBasicSelectQuery(tableName, selectStr, whereColumns) {
        let whereStr = DatabaseHelperService.turnToStr(whereColumns, " AND ");
        return `SELECT ${selectStr} FROM ${tableName} WHERE ${whereStr}`;
    }
    static doUpdateQuery(tableName, setColumns, whereColumns) {
        let setStr = DatabaseHelperService.turnToStr(setColumns, ", ");
        let whereStr = DatabaseHelperService.turnToStr(whereColumns, " AND ");
        return `UPDATE ${tableName} SET ${setStr} WHERE ${whereStr}`;
    }
    static createTables() {
        const tables = new Map();
        let table = new PartiesTable_1.PartiesTable();
        tables.set(table.getTableName(), table);
        return tables;
    }
    static turnToStr(columns, separator) {
        let str = null, column, item;
        for (column in columns) {
            if (str == null) {
                str = "";
            }
            else {
                str += separator;
            }
            item = column.getValue();
            if (column.needsSanitized()) {
                item = StringUtility_1.StringUtility.escapeMySQLInput(item);
            }
            str += `${column.getName()} = ${item}`;
        }
        return str;
    }
}
exports.DatabaseHelperService = DatabaseHelperService;
//# sourceMappingURL=DatabaseHelperService.js.map