"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartyRelatedClientResponses = void 0;
const BasicEmbed_1 = require("../../BasicEmbed");
class PartyRelatedClientResponses {
    static SELECT_PARTY(parties, action) {
        let worldStr = "";
        let party, i;
        for (i = 0; i < parties.length; i++) {
            party = parties[i];
            worldStr += `[\`${i}\`] ${party.name}\n`;
        }
        return BasicEmbed_1.BasicEmbed.get()
            .setTitle(`Please select which party you want to ${action}`)
            .setDescription(`Select from the following parties by pressing the given number:\n` +
            worldStr);
    }
}
exports.PartyRelatedClientResponses = PartyRelatedClientResponses;
//# sourceMappingURL=PartyRelatedClientResponses.js.map