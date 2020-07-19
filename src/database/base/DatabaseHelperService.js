"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseHelperService = void 0;
class DatabaseHelperService {
    /**
     * Creates a new select query.
     *
     * @param table
     */
    static doSelectQuery(table) {
        let selectStr = table.getSelectColumns();
        if (selectStr == null) {
            selectStr = "*";
        }
        return `SELECT ${selectStr} FROM ${table.getTableName()} WHERE ${table.getWhereColumns()}`;
    }
    static doUpdateQuery(table) {
        return `UPDATE ${table.getTableName()} SET ${table.getSetColumns()} WHERE ${table.getWhereColumns()}`;
    }
    static do2JoinSelectQuery(t1Table, t2Table, onColumn) {
        // Do select string.
        let selectStr = t1Table.getSelectColumns();
        if (selectStr == null) {
            selectStr += "";
        }
        else {
            selectStr += ", ";
        }
        selectStr += t2Table.getSelectColumns();
        // Do where string.
        let whereStr = t1Table.getWhereColumns();
        if (whereStr == null) {
            whereStr += "";
        }
        else {
            whereStr += " AND ";
        }
        whereStr += t2Table.getWhereColumns();
        // Do on string.
        const onStr = `t1.${onColumn.getName()} = t2.${onColumn.getValue()}`;
        return `SELECT ${selectStr} FROM ${t1Table.getTableName()} t1 INNER JOIN ${t2Table.getTableName()} t2 ON ` +
            `${onStr} WHERE ${whereStr}`;
    }
    /**
     * Creates the insert query.
     *
     * @param table The table to use. Only uses the "set" columns.
     */
    static doInsertQuery(table) {
        return `INSERT INTO ${table.getTableName()} ${table.getSetColumns()}`;
    }
}
exports.DatabaseHelperService = DatabaseHelperService;
//# sourceMappingURL=DatabaseHelperService.js.map