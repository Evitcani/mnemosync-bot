import "reflect-metadata";
require('dotenv').config(); // Recommended way of loading dotenv
import container from "./inversify.config";
import {TYPES} from "./types";
import {Bot} from "./bot";
import {createConnection} from "typeorm";

let bot = container.get<Bot>(TYPES.Bot);

createConnection({
    type: "postgres",
    url: this.databaseUrl,
    entities: [
        __dirname + "/entity/*.js"
    ],
    synchronize: true,
}).then(() => {
    bot.listen().then(() => {
        console.log('Logged in!')
    }).catch((error) => {
        console.log('Oh no! ', error)
    });
});

