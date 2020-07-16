"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoneyUtility = void 0;
class MoneyUtility {
    static pileIntoCopper(fund) {
        let amt = 0;
        if (fund.platinum !== null) {
            amt += (fund.platinum * 1000);
        }
        if (fund.gold !== null) {
            amt += (fund.gold * 100);
        }
        if (fund.silver !== null) {
            amt += (fund.silver * 10);
        }
        if (fund.copper !== null) {
            amt += fund.copper;
        }
        return amt;
    }
    static copperToFund(amt) {
        let fund = { id: null, party_id: null, type: null, platinum: 0, gold: null, silver: null,
            copper: null };
        // Gold is easy to get.
        fund.gold = Math.floor(amt / 100);
        amt = amt - (fund.gold * 100);
        fund.silver = Math.floor(amt / 10);
        amt = amt - (fund.silver * 10);
        fund.copper = amt;
        return fund;
    }
    static processMoneyArguments(args) {
        let fund = { id: null, party_id: null, type: null, platinum: 0, gold: 0, silver: 0, copper: 0 };
        let amt = -1;
        let negative = false;
        let i, arg, search;
        for (i = 0; i < args.length; i++) {
            arg = args[i];
            // If amount is non-negative, then must be waiting on a value.
            if (amt >= 0) {
                let type = MoneyUtility.giveAmountBack(arg);
                // Breaks if not formatted correctly.
                if (type === null) {
                    return null;
                }
                // Make the amount part of this moneyed item.
                type.amount = amt;
                amt = -1;
                // Add to the fund.
                fund = MoneyUtility.addToFund(type, fund);
                if (fund === null) {
                    return null;
                }
                continue;
            }
            // Check for negatives.
            if (arg.substr(0, 1) === "-") {
                negative = true;
                arg = arg.substr(1);
            }
            // Check for positives.
            if (arg.substr(0, 1) === "+") {
                arg = arg.substr(1);
            }
            let money = MoneyUtility.giveAmountBack(arg);
            // Something strange happened.
            if (money === null) {
                return null;
            }
            if (money.type === null) {
                amt = money.amount;
                continue;
            }
            // Add to the fund.
            fund = MoneyUtility.addToFund(money, fund);
            if (fund === null) {
                return null;
            }
        }
        // Make all values negative if we're subtracting.
        if (negative) {
            fund.platinum *= -1;
            fund.gold *= -1;
            fund.silver *= -1;
            fund.copper *= -1;
        }
        return fund;
    }
    /**
     * Adds the given "Money" amount to the given fund.
     *
     * @param money
     * @param fund
     */
    static addToFund(money, fund) {
        switch (money.type) {
            case "platinum":
                fund.platinum = money.amount;
                break;
            case "gold":
                fund.gold = money.amount;
                break;
            case "silver":
                fund.silver = money.amount;
                break;
            case "copper":
                fund.copper = money.amount;
                break;
            default:
                return null;
        }
        return fund;
    }
    static searchForMoneyType(arg) {
        let place = arg.search("g");
        if (place >= 0) {
            const num = arg.substr(0, place + 1);
            return num + " gold";
        }
        place = arg.search("c");
        if (place >= 0) {
            const num = arg.substr(0, place + 1);
            return num + " copper";
        }
        place = arg.search("s");
        if (place >= 0) {
            const num = arg.substr(0, place + 1);
            return num + " silver";
        }
        place = arg.search("p");
        if (place >= 0) {
            const num = arg.substr(0, place + 1);
            return num + " platinum";
        }
        return arg;
    }
    /**
     *
     * @param arg
     */
    static giveAmountBack(arg) {
        const num = Number(arg);
        if (!isNaN(num)) {
            return { "amount": num, "type": null };
        }
        const type = MoneyUtility.searchForMoneyType(arg);
        const args = type.split(" ");
        if (args.length < 2) {
            const maybeType = args[0];
            // See if it's a type.
            if (maybeType === "gold" || maybeType === "platinum" || maybeType === "silver" || maybeType === "copper") {
                return { "amount": null, "type": maybeType };
            }
            // Something weird.
            return null;
        }
        return { "amount": Number(args[0]), "type": args[1] };
    }
    static formatFundStatement(fund, type) {
        if (type !== null) {
            type = type.toLowerCase();
            type += " ";
        }
        let foundMoney = false;
        let amt = 0;
        if (fund.platinum !== null && fund.platinum > 0) {
            amt += (fund.platinum * 10);
            foundMoney = true;
        }
        if (fund.gold !== null && fund.gold > 0) {
            amt += fund.gold;
            foundMoney = true;
        }
        if (fund.silver !== null && fund.silver > 0) {
            amt += (fund.silver / 10);
            foundMoney = true;
        }
        if (fund.copper !== null && fund.copper > 0) {
            amt += (fund.copper / 100);
            foundMoney = true;
        }
        if (!foundMoney) {
            return "There is no money in this " + type + "fund!";
        }
        return "The following amount is currently in the bank fund: " + amt + " gp";
    }
}
exports.MoneyUtility = MoneyUtility;
//# sourceMappingURL=MoneyUtility.js.map