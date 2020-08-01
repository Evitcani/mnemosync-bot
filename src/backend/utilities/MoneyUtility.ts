import {Money} from "../../shared/models/database/Money";
import {MoneyType} from "../../shared/enums/MoneyType";
import {MoneyArchetype} from "../../shared/models/generic/MoneyArchetype";
import {PartyFundDTO} from "../api/dto/model/PartyFundDTO";
import {DTOType} from "../api/dto/DTOType";

/**
 * Utility for counting money.
 */
export class MoneyUtility {
    /**
     * Converts all money to base units (copper).
     *
     * @param fund The fund to turn into copper.
     */
    static pileIntoCopper (fund: PartyFundDTO): number {
        if (fund == null) {
            return 0;
        }

        let amt  = 0;

        if (fund.platinum != null) {
            amt += (fund.platinum * MoneyType.PLATINUM.baseValueMultiplier);
        }

        if (fund.gold != null) {
            amt += (fund.gold * MoneyType.GOLD.baseValueMultiplier);
        }

        if (fund.silver != null) {
            amt += (fund.silver * MoneyType.SILVER.baseValueMultiplier);
        }

        if (fund.copper != null) {
            amt += (fund.copper * MoneyType.COPPER.baseValueMultiplier);
        }

        if (fund.isNegative) {
            amt *= -1;
        }

        console.debug("PILE INTO COPPER ::: Total amount is: " + amt);

        return amt;
    }

    /**
     * Converts an amount back into fund for storage.
     *
     * @param amt The amount
     */
    static copperToFund(amt: number): PartyFundDTO {
        let fund: PartyFundDTO = {dtoType: DTOType.PARTY_FUND};

        fund.platinum = 0;

        // Gold is easy to get.
        fund.gold = Math.floor(amt / MoneyType.GOLD.baseValueMultiplier);
        amt = amt - (fund.gold * MoneyType.GOLD.baseValueMultiplier);

        fund.silver = Math.floor(amt / MoneyType.SILVER.baseValueMultiplier);
        amt = amt - (fund.silver * MoneyType.SILVER.baseValueMultiplier);

        fund.copper = amt;

        return fund;
    }

    /**
     * Process the arguments to determine how much money is being added or removed.
     *
     * @param args The arguments sent by the user to make sense of.
     */
     static processMoneyArguments (args: string[]): PartyFundDTO {
         // Creates a new fund.
        let fund: PartyFundDTO = {dtoType: DTOType.PARTY_FUND};

        // Starting amount.
        let amt = -1;

        // Keeps track of if there is a negative sign.
        let negative = false;

        // Arguments for the for loop.
        let i: number, arg: string;

        // Loop over the arguments.
        for (i = 0; i < args.length; i++) {
            // Begin argument processing.
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
            if (arg.substr(0,1) === "-") {
                negative = true;
                arg = arg.substr(1);
            }

            // Check for positives.
            if (arg.substr(0,1) === "+") {
                arg = arg.substr(1);
            }

            // Now we do a different function to process.
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
            fund.isNegative = true;
        }

        return fund;
    }

    /**
     * Adds the given "Money" amount to the given fund.
     *
     * @param money The money to put into the fund.
     * @param fund The fund to put the money into.
     */
     static addToFund (money: Money, fund: PartyFundDTO): PartyFundDTO {
        switch (money.type) {
            case MoneyType.PLATINUM:
                fund.platinum = money.amount;
                break;
            case MoneyType.GOLD:
                fund.gold = money.amount;
                break;
            case MoneyType.SILVER:
                fund.silver = money.amount;
                break;
            case MoneyType.COPPER:
                fund.copper = money.amount;
                break;
            default:
                return null;
        }

        return fund;
    }

    /**
     * Searches for the type of money type and amount.
     *
     * @param arg The argument to find the type for.
     */
     static searchForMoneyType (arg: string): Money {
        let place = arg.search(MoneyType.GOLD.shortenedName);
        if (place >= 0) {
            const num = arg.substr(0, place);
            return this.processNumber(num, MoneyType.GOLD);
        }

        place = arg.search(MoneyType.COPPER.shortenedName);
        if (place >= 0) {
            const num = arg.substr(0, place);
            return this.processNumber(num, MoneyType.COPPER);
        }

        place = arg.search(MoneyType.SILVER.shortenedName);
        if (place >= 0) {
            const num = arg.substr(0, place);
            return this.processNumber(num, MoneyType.SILVER);
        }

        place = arg.search(MoneyType.PLATINUM.shortenedName);
        if (place >= 0) {
            const num = arg.substr(0, place);
            return this.processNumber(num, MoneyType.PLATINUM);
        }

        return null;
    }

    /**
     * Processes the string into a money type.
     *
     * @param str The string to turn into a number.
     * @param type The type of the number.
     */
    private static processNumber(str: string, type: MoneyArchetype): Money {
         let num = null;
         if (str != null && str.length > 0) {
             num = Number(str);
             if (isNaN(num)) {
                 num = 0;
             }
         }
         return new Money(num, type);
    }

    /**
     *  Tries to figure out where the arg belongs.
     *
     * @param arg The arg to process into a number and type.
     */
     static giveAmountBack(arg: string): Money {
         // Rule out money only.
        const num = Number(arg);
        if (!isNaN(num)) {
            return new Money(num, null);
        }

        // Go out and get the number and type.
        const money = MoneyUtility.searchForMoneyType(arg);

        // If null, return null.
        if (money == null) {
            return null;
        }

        // Return money.
        return money;
    }
}