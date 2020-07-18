import {AbstractColumn} from "./columns/AbstractColumn";

export abstract class AbstractTable {
    private readonly tableName: string;
    private readonly columns: AbstractColumn[];

    protected constructor(tableName: string, columns: AbstractColumn[]) {
        this.tableName = tableName;
        this.columns = columns;
    }

    public getTableName(): string {
        return this.tableName;
    }

    public getColumns(): AbstractColumn[] {
        return this.columns;
    }
}