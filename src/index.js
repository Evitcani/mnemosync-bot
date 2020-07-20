"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require('dotenv').config(); // Recommended way of loading dotenv
const inversify_config_1 = require("./inversify.config");
const types_1 = require("./types");
const typeorm_1 = require("typeorm");
let bot = inversify_config_1.default.get(types_1.TYPES.Bot);
typeorm_1.createConnection({
    type: "postgres",
    url: this.databaseUrl,
    entities: [
        __dirname + "/entity/*.js"
    ],
    synchronize: true,
}).then(() => {
    bot.listen().then(() => {
        console.log('Logged in!');
    }).catch((error) => {
        console.log('Oh no! ', error);
    });
});
//# sourceMappingURL=index.js.map