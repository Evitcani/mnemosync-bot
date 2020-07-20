import {DbColumn} from "../../models/database/schema/columns/DbColumn";
import {DbTable} from "../../models/database/schema/DbTable";

export class DatabaseHelperService {

    /**
     * Creates a new select query.
     *
     * @param table
     */
    public static doSelectQuery (table: DbTable): string {
        let selectStr = table.getSelectColumns();
        if (selectStr == null) {
            selectStr = "*";
        }
        return `SELECT ${selectStr} FROM ${table.getTableName()} WHERE ${table.getWhereColumns()}`;
    }

    public static doUpdateQuery (table: DbTable): string {
        return `UPDATE ${table.getTableName()} SET ${table.getSetColumns()} WHERE ${table.getWhereColumns()}`;
    }

    public static do2JoinSelectQuery(t1Table: DbTable, t2Table: DbTable, onColumn: DbColumn): string {
        // Do select string.
        let selectStr = t1Table.getSelectColumns();
        let t2SelectStr = t2Table.getSelectColumns();
        if (selectStr == null) {
            selectStr = "";
        } else {
            selectStr += ", ";
        }

        if (t2SelectStr != null) {
            selectStr += t2SelectStr;
        }

        // Do where string.
        let whereStr = t1Table.getWhereColumns();
        let t2WhereStr = t2Table.getWhereColumns();
        if (whereStr == null) {
            whereStr = "";
        } else {
            whereStr += " AND "
        }

        if (t2WhereStr != null) {
            whereStr += t2WhereStr;
        }

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
    public static doInsertQuery(table: DbTable): string {
        return `INSERT INTO ${table.getTableName()} ${table.getInsertColumns()}`;
    }
}