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
    url: process.env.DATABASE_URL,
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
}).catch((err) => {
    console.log('Unable to create connection! ', err.message);
    console.error(err);
});
//# sourceMappingURL=index.js.map