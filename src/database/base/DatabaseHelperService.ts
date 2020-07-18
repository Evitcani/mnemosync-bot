import {AbstractTable} from "../../models/database/schema/AbstractTable";
import {PartiesTable} from "../../models/database/schema/PartiesTable";
import {DbColumn} from "../../models/database/schema/columns/DbColumn";

export class DatabaseHelperService {
    private tables: Map<string, AbstractTable>;

    constructor() {
        this.tables = DatabaseHelperService.createTables();
    }

    public static doSelectQuery(tableName: string, whereColumns: DbColumn[]) {
        return DatabaseHelperService.doBasicSelectQuery(tableName, "*", whereColumns);
    }

    public static doSelectQueryWithColumns(tableName: string, selectColumns: DbColumn[], whereColumns: DbColumn[]): string {
        return DatabaseHelperService.doBasicSelectQuery(tableName, DatabaseHelperService.turnToStr(selectColumns, ", "), whereColumns);
    }

    private static doBasicSelectQuery (tableName: string, selectStr: string, whereColumns: DbColumn[]): string {
        let whereStr = DatabaseHelperService.turnToStr(whereColumns, " AND ");
        return `SELECT ${selectStr} FROM ${tableName} WHERE ${whereStr}`;
    }

    public static doUpdateQuery (tableName: string, setColumns: DbColumn[], whereColumns: DbColumn[]): string {
        let setStr = DatabaseHelperService.turnToStr(setColumns, ", ");
        let whereStr = DatabaseHelperService.turnToStr(whereColumns, " AND ");
        return `UPDATE ${tableName} SET ${setStr} WHERE ${whereStr}`;
    }

    private static createTables(): Map<string, AbstractTable> {
        const tables: Map<string, AbstractTable> = new Map<string, AbstractTable>();

        let table = new PartiesTable();
        tables.set(table.getTableName(), table);

        return tables;
    }

    private static turnToStr(columns: DbColumn[], separator: string): string {
        let str = null, column: DbColumn, i: number;
        for (i = 0; i < columns.length; i++) {
            column = columns[i];
            if (str == null) {
                str = "";
            } else {
                str += separator;
            }

            str += `${column.getName()}${column.getDivider()}${column.getValue()}`;
        }

        return str;
    }
}