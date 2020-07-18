import {AbstractTable} from "./AbstractTable";
import {IdColumn} from "./columns/IdColumn";
import {NameColumn} from "./columns/NameColumn";
import {Table} from "../../../documentation/databases/Table";

export class PartiesTable extends AbstractTable {
    constructor() {
        super(Table.PARTY, [new IdColumn(), new NameColumn()]);
    }
}