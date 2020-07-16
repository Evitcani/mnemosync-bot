import {DatabaseReturnField} from "./DatabaseReturnField";

export interface DatabaseReturn {
    command: string,
    rowCount: number,
    oid: string,
    rows: JSON[],
    fields: DatabaseReturnField[]
}