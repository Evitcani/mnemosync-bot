import {inject, injectable} from "inversify";
import {TYPES} from "../../types";
const crypto = require('crypto');

@injectable()
export class EncryptionUtility {
    private readonly key: string;
    private static algorithm = 'aes-256-cbc';
    
    constructor(@inject(TYPES.CryptKey) cryptKey: string) {
        this.key = cryptKey;
    }

    encrypt(text: string): string {
        const iv = crypto.randomBytes(16);

        let cipher = crypto.createCipheriv(EncryptionUtility.algorithm, Buffer.from(this.key), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }

    decrypt(text: string): string {
        let args = text.split(":");
        
        let iv = Buffer.from(args[0], 'hex');
        let encryptedText = Buffer.from(args[1], 'hex');
        let decipher = crypto.createDecipheriv(EncryptionUtility.algorithm, Buffer.from(this.key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}

