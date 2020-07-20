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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nickname = void 0;
const typeorm_1 = require("typeorm");
const Character_1 = require("./Character");
const Table_1 = require("../documentation/databases/Table");
const StringUtility_1 = require("../utilities/StringUtility");
let Nickname = class Nickname {
    purifyInsertUpdate() {
        this.name = StringUtility_1.StringUtility.escapeSQLInput(this.name);
        this.discord_id = StringUtility_1.StringUtility.escapeSQLInput(this.discord_id);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('increment'),
    __metadata("design:type", Number)
], Nickname.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Nickname.prototype, "createdDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Nickname.prototype, "updatedDate", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], Nickname.prototype, "discord_id", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], Nickname.prototype, "name", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Character_1.Character, {
        cascade: true
    }),
    __metadata("design:type", Character_1.Character)
], Nickname.prototype, "character", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    typeorm_1.BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Nickname.prototype, "purifyInsertUpdate", null);
Nickname = __decorate([
    typeorm_1.Entity({ name: Table_1.Table.USER_TO_CHARACTER })
], Nickname);
exports.Nickname = Nickname;
//# sourceMappingURL=Nickname.js.map