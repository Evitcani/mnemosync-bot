import {AbstractColumn} from "./AbstractColumn";
import {ColumnName} from "../../../../documentation/databases/ColumnName";

export class TravelConfigColumn extends AbstractColumn {
    constructor() {
        super(ColumnName.TRAVEL_CONFIG, "json");
    }
}