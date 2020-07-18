import {AbstractColumn} from "./AbstractColumn";

export class NameColumn extends AbstractColumn {
    constructor() {
        super("name", "string");
    }
}