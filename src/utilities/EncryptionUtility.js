"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var EncryptionUtility_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionUtility = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const crypto = require('crypto');
let EncryptionUtility = EncryptionUtility_1 = class EncryptionUtility {
    constructor(cryptKey) {
        this.key = cryptKey;
    }
    encrypt(text) {
        const iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv(EncryptionUtility_1.algorithm, Buffer.from(this.key), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }
    decrypt(text) {
        let args = text.split(":");
        let iv = Buffer.from(args[0], 'hex');
        let encryptedText = Buffer.from(args[1], 'hex');
        let decipher = crypto.createDecipheriv(EncryptionUtility_1.algorithm, Buffer.from(this.key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
};
EncryptionUtility.algorithm = 'aes-256-cbc';
EncryptionUtility = EncryptionUtility_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.CryptKey)),
    __metadata("design:paramtypes", [String])
], EncryptionUtility);
exports.EncryptionUtility = EncryptionUtility;
//# sourceMappingURL=EncryptionUtility.js.map