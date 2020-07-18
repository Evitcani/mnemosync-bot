export abstract class AbstractColumn {
    private readonly name: string;
    private readonly type: string;

    protected constructor(name: string, type: string) {
        this.name = name;
        this.type = type;
    }

    public getName(): string {
        return this.name;
    }

    public getType(): string {
        return this.type;
    }
}