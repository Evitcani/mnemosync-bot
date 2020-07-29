import {AbstractColumn} from "./AbstractColumn";
import {ColumnName} from "../../../../documentation/databases/ColumnName";

export class IdColumn extends AbstractColumn {
    constructor() {
        super(ColumnName.ID, "number")
    }
}