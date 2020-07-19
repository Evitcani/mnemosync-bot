import {AbstractColumn} from "./AbstractColumn";
import {Column} from "../../../../documentation/databases/Column";

export class PartyIdColumn extends AbstractColumn {
    constructor() {
        super(Column.PARTY_ID, "number");
    }
}