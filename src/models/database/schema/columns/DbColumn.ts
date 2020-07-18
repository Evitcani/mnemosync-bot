export class DbColumn {
    private readonly name: string;
    private readonly value: any;
    private readonly sanitize: boolean;

    constructor(name: string, value: any, sanitize: boolean) {
        this.name = name;
        this.value = value;
        this.sanitize = sanitize;
    }

    public getName(): string {
        return this.name;
    }

    public getValue(): any {
        return this.value;
    }

    public needsSanitized(): boolean {
        return this.sanitize;
    }
}