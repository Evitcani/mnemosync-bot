import {AbstractTransportAnimal} from "./AbstractTransportAnimal";
import {CreatureSize} from "../enums/CreatureSize";

export class Donkey extends AbstractTransportAnimal {
    constructor() {
        super("Donkey", 8, 420, CreatureSize.LARGE);
    }
}