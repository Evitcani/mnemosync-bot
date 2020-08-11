import {AbstractTable} from "./AbstractTable";
import {IdColumn} from "./columns/IdColumn";
import {NameColumn} from "./columns/NameColumn";
import {TableName} from "../../../documentation/databases/TableName";

export class PartiesTable extends AbstractTable {
    constructor() {
        super(TableName.PARTY, [new IdColumn(), new NameColumn()]);
    }
}