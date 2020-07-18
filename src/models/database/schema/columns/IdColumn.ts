import {AbstractColumn} from "./AbstractColumn";

export class IdColumn extends AbstractColumn {
    constructor() {
        super("id", "number")
    }
}