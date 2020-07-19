"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbTable = void 0;
const DatabaseDivider_1 = require("../../../enums/DatabaseDivider");
class DbTable {
    constructor(tableName) {
        this.tableName = tableName;
    }
    setDesignation(designation) {
        this.designation = designation;
        return this;
    }
    getTableName() {
        return this.tableName;
    }
    setInsertColumns(columns) {
        this.insertColumns = columns;
        return this;
    }
    addInsertColumns(column) {
        if (this.insertColumns == null) {
            this.insertColumns = [];
        }
        this.insertColumns.push(column);
        return this;
    }
    getInsertColumns() {
        return DbTable.turnToStrInsert(this.insertColumns);
    }
    getSelectColumns() {
        return this.turnSelectColumnsToStr();
    }
    setSelectColumns(columns) {
        this.selectColumns = columns;
        return this;
    }
    addSelectColumns(column) {
        if (this.selectColumns == null) {
            this.selectColumns = [];
        }
        this.selectColumns.push(column);
        return this;
    }
    getSetColumns() {
        return this.turnToStr(this.setColumns, ", ");
    }
    setSetColumns(columns) {
        this.setColumns = columns;
        return this;
    }
    addSetColumns(column) {
        if (this.setColumns == null) {
            this.setColumns = [];
        }
        this.setColumns.push(column);
        return this;
    }
    setWhereColumns(columns) {
        this.whereColumns = columns;
        return this;
    }
    addWhereColumns(column) {
        if (this.whereColumns == null) {
            this.whereColumns = [];
        }
        this.whereColumns.push(column);
        return this;
    }
    getWhereColumns() {
        return this.turnToStr(this.whereColumns, " AND ");
    }
    static turnToStrInsert(columns) {
        if (columns == null) {
            return null;
        }
        let names = null, values = null, i, column;
        for (i = 0; i < columns.length; i++) {
            column = columns[i];
            if (names == null) {
                names = "";
            }
            else {
                names += ", ";
            }
            if (values == null) {
                values = "";
            }
            else {
                values += ", ";
            }
            names += column.getName();
            values += column.getValue();
        }
        return `(${names}) VALUES (${values})`;
    }
    turnSelectColumnsToStr() {
        if (this.selectColumns == null) {
            return null;
        }
        let str = null, column, i;
        for (i = 0; i < this.selectColumns.length; i++) {
            column = this.selectColumns[i];
            if (str == null) {
                str = "";
            }
            else {
                str += ", ";
            }
            if (this.designation != null) {
                str += `t${this.designation}.`;
            }
            str += `${column.getName()}`;
        }
        return str;
    }
    turnToStr(columns, separator) {
        if (columns == null) {
            return null;
        }
        let str = null, column, i;
        let colName, colValue;
        for (i = 0; i < columns.length; i++) {
            column = columns[i];
            if (str == null) {
                str = "";
            }
            else {
                str += separator;
            }
            colName = column.getName();
            colValue = column.getValue();
            if (this.designation != null) {
                colName = `t${this.designation}.${colName}`;
            }
            // Must add the lower designation.
            if (column.getDivider() == DatabaseDivider_1.DatabaseDivider.LIKE) {
                colName = `LOWER(${colName})`;
                colValue = `LOWER(${colValue})`;
            }
            str += `${colName}}${column.getDivider()}${colValue}`;
        }
        return str;
    }
}
exports.DbTable = DbTable;
//# sourceMappingURL=DbTable.js.map