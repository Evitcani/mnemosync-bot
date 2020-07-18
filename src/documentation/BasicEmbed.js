"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicEmbed = void 0;
const discord_js_1 = require("discord.js");
class BasicEmbed {
    /**
     * Gets the basic embed with some fields.
     */
    static get() {
        return new discord_js_1.MessageEmbed()
            .setColor('#0099ff')
            .setFooter('Created by @Evit_cani on Twitter.');
    }
}
exports.BasicEmbed = BasicEmbed;
//# sourceMappingURL=BasicEmbed.js.map