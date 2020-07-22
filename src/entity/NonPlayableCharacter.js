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
exports.NonPlayableCharacter = void 0;
const typeorm_1 = require("typeorm");
const World_1 = require("./World");
const Table_1 = require("../documentation/databases/Table");
let NonPlayableCharacter = class NonPlayableCharacter {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], NonPlayableCharacter.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], NonPlayableCharacter.prototype, "name", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "created_date" }),
    __metadata("design:type", Date)
], NonPlayableCharacter.prototype, "createdDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: "updated_date" }),
    __metadata("design:type", Date)
], NonPlayableCharacter.prototype, "updatedDate", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, name: "world_id" }),
    __metadata("design:type", String)
], NonPlayableCharacter.prototype, "worldId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => World_1.World, world => world.npcs, {
        nullable: true,
        onDelete: "SET NULL"
    }),
    typeorm_1.JoinColumn({ name: "world_id" }),
    __metadata("design:type", World_1.World)
], NonPlayableCharacter.prototype, "world", void 0);
NonPlayableCharacter = __decorate([
    typeorm_1.Entity({ name: Table_1.Table.NPC })
], NonPlayableCharacter);
exports.NonPlayableCharacter = NonPlayableCharacter;
//# sourceMappingURL=NonPlayableCharacter.js.map