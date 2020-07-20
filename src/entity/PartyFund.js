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
exports.PartyFund = void 0;
const typeorm_1 = require("typeorm");
const Party_1 = require("./Party");
const StringUtility_1 = require("../utilities/StringUtility");
let PartyFund = class PartyFund {
    purifyInsertUpdate() {
        this.type = StringUtility_1.StringUtility.escapeSQLInput(this.type);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('increment'),
    __metadata("design:type", Number)
], PartyFund.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], PartyFund.prototype, "createdDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], PartyFund.prototype, "updatedDate", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Party_1.Party, party => party.funds, {
        cascade: true
    }),
    __metadata("design:type", Party_1.Party)
], PartyFund.prototype, "party", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], PartyFund.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], PartyFund.prototype, "platinum", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], PartyFund.prototype, "gold", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], PartyFund.prototype, "silver", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], PartyFund.prototype, "copper", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    typeorm_1.BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PartyFund.prototype, "purifyInsertUpdate", null);
PartyFund = __decorate([
    typeorm_1.Entity({ name: "party_funds" })
], PartyFund);
exports.PartyFund = PartyFund;
//# sourceMappingURL=PartyFund.js.map