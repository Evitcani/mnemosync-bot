export class MoneyArchetype {
    name: string;
    shortenedName: string;
    baseValueMultiplier: number;

    constructor(name: string, shortenedName: string, baseValueMultiplier: number) {
        this.name = name;
        this.shortenedName = shortenedName;
        this.baseValueMultiplier = baseValueMultiplier;
    }
}