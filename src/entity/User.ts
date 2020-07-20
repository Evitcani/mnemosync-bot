import {Character} from "./Character";

export interface User {
    id: number;
    discord_name: string;
    discord_id: string;
    character_id: number;
    character: Character;
}