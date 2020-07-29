import "reflect-metadata";
require('dotenv').config(); // Recommended way of loading dotenv
import container from "./inversify.config";
import {TYPES} from "./types";
import {Bot} from "./bot/bot";
import {createConnection} from "typeorm";

let bot = container.get<Bot>(TYPES.Bot);

createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [
        __dirname + "/backend/entity/**/*.js"
    ],
    synchronize: true,
}).then(() => {
    bot.listen().then(() => {
        console.log('Logged in!')
    }).catch((error) => {
        console.log('Oh no! ', error)
    });
}).catch((err: Error) => {
    console.log('Unable to create connection!');
    console.error(err);
});

