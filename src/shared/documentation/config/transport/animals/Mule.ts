import {AbstractTransportAnimal} from "./AbstractTransportAnimal";
import {CreatureSize} from "../enums/CreatureSize";

export class Mule extends AbstractTransportAnimal {
    constructor() {
        super("Mule", 8, 420, CreatureSize.LARGE);
    }
}