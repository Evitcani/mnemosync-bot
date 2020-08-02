import {DatabaseDivider} from "@evitcani/mnemoshared/dist/src/enums/DatabaseDivider";
import {StringUtility} from "@evitcani/mnemoshared/dist/src/utilities/StringUtility";

export class DbColumn {
    private readonly name: string;
    private readonly value: any;
    private sanitize: boolean = false;
    private divider: DatabaseDivider = DatabaseDivider.DEFAULT;

    constructor(name: string, value: any) {
        this.name = name;
        this.value = value;
    }

    public getName(): string {
        return this.name;
    }

    public getValue(): any {
        let value;

        if (this.divider == DatabaseDivider.LIKE) {
            value = `%${this.value}%`;
        } else {
            value = this.value;
        }

        if (this.needsSanitized()) {
            value = StringUtility.escapeMySQLInput(value);
        }

        return value;
    }

    private needsSanitized(): boolean {
        return this.sanitize;
    }

    public setSanitized(sanitize: boolean): DbColumn {
        this.sanitize = sanitize;
        return this;
    }

    public setDivider(divider: DatabaseDivider): DbColumn {
        this.divider = divider;
        return this;
    }

    public getDivider(): string {
        return this.divider;
    }
}