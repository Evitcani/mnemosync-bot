import {AbstractTransportAnimal} from "./AbstractTransportAnimal";
import {CreatureSize} from "../enums/CreatureSize";

export class Camel extends AbstractTransportAnimal {
    constructor() {
        super("Camel", 50, 480, CreatureSize.LARGE);
    }
}