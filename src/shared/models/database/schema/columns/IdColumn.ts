import {AbstractColumn} from "./AbstractColumn";
import {Column} from "../../../../documentation/databases/Column";

export class IdColumn extends AbstractColumn {
    constructor() {
        super(Column.ID, "number")
    }
}