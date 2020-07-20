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
exports.Party = void 0;
const typeorm_1 = require("typeorm");
const Character_1 = require("./Character");
const PartyFund_1 = require("./PartyFund");
const StringUtility_1 = require("../utilities/StringUtility");
let Party = class Party {
    purifyInsertUpdate() {
        this.name = StringUtility_1.StringUtility.escapeMySQLInput(this.name);
        this.guildId = StringUtility_1.StringUtility.escapeMySQLInput(this.guildId);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('increment'),
    __metadata("design:type", Number)
], Party.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], Party.prototype, "name", void 0);
__decorate([
    typeorm_1.Column("text", { name: "guild_id" }),
    __metadata("design:type", String)
], Party.prototype, "guildId", void 0);
__decorate([
    typeorm_1.OneToMany(type => Character_1.Character, member => member.party, {
        nullable: true,
        onDelete: "SET NULL"
    }),
    __metadata("design:type", Array)
], Party.prototype, "members", void 0);
__decorate([
    typeorm_1.OneToMany(type => PartyFund_1.PartyFund, fund => fund.party, {
        onDelete: "SET NULL"
    }),
    __metadata("design:type", Array)
], Party.prototype, "funds", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    typeorm_1.BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Party.prototype, "purifyInsertUpdate", null);
Party = __decorate([
    typeorm_1.Entity({ name: "parties" })
], Party);
exports.Party = Party;
//# sourceMappingURL=Party.js.map