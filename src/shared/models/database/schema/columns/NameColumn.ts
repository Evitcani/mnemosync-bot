import {AbstractColumn} from "./AbstractColumn";
import {ColumnName} from "../../../../documentation/databases/ColumnName";

export class NameColumn extends AbstractColumn {
    constructor() {
        super(ColumnName.NAME, "string");
    }
}