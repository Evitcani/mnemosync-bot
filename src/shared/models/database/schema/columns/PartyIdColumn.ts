import {AbstractColumn} from "./AbstractColumn";
import {ColumnName} from "../../../../documentation/databases/ColumnName";

export class PartyIdColumn extends AbstractColumn {
    constructor() {
        super(ColumnName.PARTY_ID, "number");
    }
}