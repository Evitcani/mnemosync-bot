import {AbstractColumn} from "./AbstractColumn";
import {Column} from "../../../../documentation/databases/Column";

export class TravelConfigColumn extends AbstractColumn {
    constructor() {
        super(Column.TRAVEL_CONFIG, "json");
    }
}