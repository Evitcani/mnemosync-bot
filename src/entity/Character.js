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
exports.Character = void 0;
const TravelConfig_1 = require("./TravelConfig");
const typeorm_1 = require("typeorm");
const Party_1 = require("./Party");
const Nickname_1 = require("./Nickname");
const StringUtility_1 = require("../utilities/StringUtility");
const User_1 = require("./User");
let Character = class Character {
    purifyInsertUpdate() {
        this.name = StringUtility_1.StringUtility.escapeSQLInput(this.name);
        this.img_url = StringUtility_1.StringUtility.escapeSQLInput(this.img_url);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('increment'),
    __metadata("design:type", Number)
], Character.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Character.prototype, "createdDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Character.prototype, "updatedDate", void 0);
__decorate([
    typeorm_1.Column("text", { nullable: true }),
    __metadata("design:type", String)
], Character.prototype, "img_url", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], Character.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToOne(type => TravelConfig_1.TravelConfig, travelConfig => travelConfig.character, {
        eager: true,
        nullable: true,
        onDelete: "SET NULL"
    }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", TravelConfig_1.TravelConfig)
], Character.prototype, "travel_config", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Character.prototype, "partyId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Party_1.Party, party => party.members, {
        eager: true,
        nullable: true,
        onDelete: "SET NULL"
    }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Party_1.Party)
], Character.prototype, "party", void 0);
__decorate([
    typeorm_1.OneToMany(type => Nickname_1.Nickname, nickname => nickname.character, {
        onDelete: "SET NULL"
    }),
    __metadata("design:type", Array)
], Character.prototype, "nicknames", void 0);
__decorate([
    typeorm_1.OneToMany(type => User_1.User, user => user.defaultCharacter, {
        onDelete: "SET NULL"
    }),
    __metadata("design:type", Array)
], Character.prototype, "defaultUsers", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    typeorm_1.BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Character.prototype, "purifyInsertUpdate", null);
Character = __decorate([
    typeorm_1.Entity({ name: "characters" })
], Character);
exports.Character = Character;
//# sourceMappingURL=Character.js.map