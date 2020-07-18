"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundRelatedClientResponses = void 0;
const StringUtility_1 = require("../../utilities/StringUtility");
const discord_js_1 = require("discord.js");
const BasicEmbed_1 = require("../BasicEmbed");
/**
 * A class for formatting responses related to the `$FUND` and `$BANK` commands.
 */
class FundRelatedClientResponses {
    static GET_MONEY(currentMoney, type, partyName) {
        let input = StringUtility_1.StringUtility.numberWithCommas(Math.abs(currentMoney));
        return BasicEmbed_1.BasicEmbed.get()
            .setTitle(`Money in ${partyName}'s ${type.toLowerCase()}`)
            .addField("Current Amount", `${input} gp`, true)
            .addField("Description", FundRelatedClientResponses.getResponseBasedOnAmount(currentMoney), false);
    }
    /**
     * The response for if there is not enough money to perform a certain action.
     *
     * @param currentMoney The current amount of money in the account.
     * @param amtToWithdraw The amount of money attempted to be withdrawn.
     * @param difference The amount needed to complete the transaction.
     * @return An embed to send back to  the client.
     */
    static NOT_ENOUGH_MONEY(currentMoney, amtToWithdraw, difference) {
        let input3 = StringUtility_1.StringUtility.numberWithCommas(Math.abs(difference));
        return this.getTwoInputEmbed('Too little, too late!', 'Remaining funds', currentMoney, 'Attempted to withdraw', amtToWithdraw, `You don't have enough money to do that. You are short ${input3} gp!`);
    }
    static UPDATED_MONEY(currentMoney, previousAmt, difference, isWithdrawn) {
        let input3 = StringUtility_1.StringUtility.numberWithCommas(Math.abs(difference));
        return this.getTwoInputEmbed(`You ${isWithdrawn ? "withdraw" : "add"} some money!`, 'Current Amount', currentMoney, 'Previous Amount', previousAmt, `You have updated the party funds by ${isWithdrawn ? "withdrawing" : "adding"} ${input3} gp!`);
    }
    static getTwoInputEmbed(title, inputTitle1, currentMoney, inputTitle2, amtToWithdraw, description) {
        let input1 = StringUtility_1.StringUtility.numberWithCommas(Math.abs(currentMoney));
        let input2 = StringUtility_1.StringUtility.numberWithCommas(Math.abs(amtToWithdraw));
        return BasicEmbed_1.BasicEmbed.get()
            .setTitle(title)
            .addField(inputTitle1, `${input1} gp`, true)
            .addField(inputTitle2, `${input2} gp`, true)
            .addField("Description", description, false);
    }
    static getResponseBasedOnAmount(amt) {
        if (amt < 1) {
            return FundRelatedClientResponses.responses.get(1).random();
        }
        if (amt < 10) {
            return FundRelatedClientResponses.responses.get(10).random();
        }
        return FundRelatedClientResponses.responses.get(100).random();
    }
    static createResponses() {
        const collection = new discord_js_1.Collection();
        // Responses less than one.
        let col = new discord_js_1.Collection();
        col.set(0, "Keeping chump change, huh?");
        col.set(1, "Guess no one can be bothered to help the party out...");
        col.set(2, "Might want to do something about that soon.");
        collection.set(1, col);
        // Responses less than 10.
        col = new discord_js_1.Collection();
        col.set(0, "Wow! So much money! You might be able to buy, what, a single banana?");
        col.set(1, "This is enough money for a single night at the Decadent Wyrm! ... If you flirt your way in.");
        col.set(2, "Could take that down to the Cat's Configuration! ... Only if you're living in the before-times " +
            "and you're Mila.");
        collection.set(10, col);
        col = new discord_js_1.Collection();
        col.set(0, "Just got started, huh? We've all been level 3.");
        col.set(1, "Hmm... The party is running low. Might be time to ask your local knife collector for a side quest.");
        col.set(2, "That's almost two whole horses! But only draft horses. Isn't it weird the cool, big horses cost less?");
        collection.set(100, col);
        return collection;
    }
}
exports.FundRelatedClientResponses = FundRelatedClientResponses;
FundRelatedClientResponses.responses = FundRelatedClientResponses.createResponses();
//# sourceMappingURL=FundRelatedClientResponses.js.map