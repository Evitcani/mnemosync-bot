import {AbstractColumn} from "./AbstractColumn";
import {Column} from "../../../../documentation/databases/Column";

export class NameColumn extends AbstractColumn {
    constructor() {
        super(Column.NAME, "string");
    }
}