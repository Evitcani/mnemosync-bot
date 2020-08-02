import {EncryptionUtility} from "@evitcani/mnemoshared/dist/src/utilities/EncryptionUtility";
import {injectable} from "inversify";

@injectable()
export class Encryption extends EncryptionUtility {
    constructor() {
        super(process.env.CRYPT_KEY);
    }
}