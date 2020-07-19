import {DbColumn} from "./columns/DbColumn";
import {DatabaseDivider} from "../../../enums/DatabaseDivider";

export class DbTable {
    private designation: number;
    private tableName: string;
    private insertColumns: DbColumn[];
    private setColumns: DbColumn[];
    private selectColumns: DbColumn[];
    private whereColumns: DbColumn[];

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    public setDesignation(designation: number): DbTable {
        this.designation = designation;
        return this;
    }

    public getTableName(): string {
        return this.tableName;
    }

    public setInsertColumns(columns: DbColumn[]): DbTable {
        this.insertColumns = columns;
        return this;
    }

    public addInsertColumns(column: DbColumn): DbTable {
        if (this.insertColumns == null) {
            this.insertColumns = [];
        }
        this.insertColumns.push(column);
        return this;
    }

    public getInsertColumns(): string {
        return DbTable.turnToStrInsert(this.insertColumns);
    }

    public getSelectColumns(): string {
        return this.turnSelectColumnsToStr();
    }

    public setSelectColumns(columns: DbColumn[]): DbTable {
        this.selectColumns = columns;
        return this;
    }

    public addSelectColumns(column: DbColumn): DbTable {
        if (this.selectColumns == null) {
            this.selectColumns = [];
        }
        this.selectColumns.push(column);
        return this;
    }

    public getSetColumns(): string {
        return this.turnToStr(this.setColumns, ", ");
    }

    public setSetColumns(columns: DbColumn[]): DbTable {
        this.setColumns = columns;
        return this;
    }

    public addSetColumns(column: DbColumn): DbTable {
        if (this.setColumns == null) {
            this.setColumns = [];
        }
        this.setColumns.push(column);
        return this;
    }

    public setWhereColumns(columns: DbColumn[]): DbTable {
        this.whereColumns = columns;
        return this;
    }

    public addWhereColumns(column: DbColumn): DbTable {
        if (this.whereColumns == null) {
            this.whereColumns = [];
        }
        this.whereColumns.push(column);
        return this;
    }

    public getWhereColumns(): string {
        return this.turnToStr(this.whereColumns, " AND ");
    }

    private static turnToStrInsert(columns: DbColumn[]): string {
        if (columns == null) {
            return null;
        }

        let names = null, values = null, i: number, column: DbColumn;
        for (i = 0; i < columns.length; i++) {
            column = columns[i];
            if (names == null) {
                names = "";
            } else {
                names += ", ";
            }

            if (values == null) {
                values = "";
            } else {
                values += ", ";
            }

            names += column.getName();
            values += column.getValue();
        }

        return `(${names}) VALUES (${values})`;
    }

    private turnSelectColumnsToStr(): string {
        if (this.selectColumns == null) {
            return null;
        }

        let str = null, column: DbColumn, i: number;
        for (i = 0; i < this.selectColumns.length; i++) {
            column = this.selectColumns[i];
            if (str == null) {
                str = "";
            } else {
                str += ", ";
            }

            if (this.designation != null) {
                str += `t${this.designation}.`;
            }

            str += `${column.getName()}`;
        }

        return str;
    }

    private turnToStr(columns: DbColumn[], separator: string): string {
        if (columns == null) {
            return null;
        }
        let str = null, column: DbColumn, i: number;
        let colName: string, colValue:string;
        for (i = 0; i < columns.length; i++) {
            column = columns[i];
            if (str == null) {
                str = "";
            } else {
                str += separator;
            }

            colName = column.getName();
            colValue = column.getValue();

            if (this.designation != null) {
                colName = `t${this.designation}.${colName}`;
            }

            // Must add the lower designation.
            if (column.getDivider() == DatabaseDivider.LIKE) {
                colName = `LOWER(${colName})`;
                colValue = `LOWER(${colValue})`;
            }

            str += `${colName}}${column.getDivider()}${colValue}`;
        }

        return str;
    }
}