import {MoneyArchetype} from "../generic/MoneyArchetype";

export class Money {
    amount: number;
    type: MoneyArchetype;

    constructor(amount: number, type: MoneyArchetype) {
        this.amount = amount;
        this.type = type;
    }
}