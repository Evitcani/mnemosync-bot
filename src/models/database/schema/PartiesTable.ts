import {AbstractTable} from "./AbstractTable";
import {IdColumn} from "./columns/IdColumn";
import {NameColumn} from "./columns/NameColumn";

export class PartiesTable extends AbstractTable {
    constructor() {
        super("parties", [new IdColumn(), new NameColumn()]);
    }
}