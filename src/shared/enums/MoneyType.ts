import {MoneyArchetype} from "../models/generic/MoneyArchetype";

export class MoneyType {
    static PLATINUM = new MoneyArchetype("platinum", "p", 1000);
    static GOLD = new MoneyArchetype("gold", "g", 100);
    static SILVER = new MoneyArchetype("silver", "s", 10);
    static COPPER = new MoneyArchetype("copper", "c", 1);
}