"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Task = void 0;
var user_entity_1 = require("../../user/entities/user.entity");
var column_entity_1 = require("../../column/entities/column.entity");
var comment_entity_1 = require("../../comment/entities/comment.entity");
var task_types_1 = require("../types/task.types");
var typeorm_1 = require("typeorm");
var class_validator_1 = require("class-validator");
var Task = /** @class */ (function () {
    function Task() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn({ unsigned: true })
    ], Task.prototype, "id");
    __decorate([
        class_validator_1.IsNumber(),
        class_validator_1.IsNotEmpty({ message: '칼럼 ID를 입력해주세요.' }),
        typeorm_1.Column({ type: 'int', unsigned: true, name: 'columnId', nullable: false })
    ], Task.prototype, "columnId");
    __decorate([
        typeorm_1.Column({ type: 'int', unsigned: true, name: 'userId', nullable: false })
    ], Task.prototype, "userId");
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsNotEmpty({ message: '이름이 없습니다.' }),
        typeorm_1.Column({ type: 'varchar', nullable: false })
    ], Task.prototype, "name");
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsNotEmpty({ message: '설명이 없습니다.' }),
        typeorm_1.Column({ type: 'text' })
    ], Task.prototype, "info");
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsNotEmpty({ message: '색상이 없습니다.' }),
        typeorm_1.Column({ type: 'varchar', nullable: false })
    ], Task.prototype, "color");
    __decorate([
        typeorm_1.Column({ type: 'varchar', nullable: true })
    ], Task.prototype, "fileUrl");
    __decorate([
        typeorm_1.Column({ type: 'varchar', nullable: false })
    ], Task.prototype, "order");
    __decorate([
        typeorm_1.Column({ type: 'datetime' })
    ], Task.prototype, "dueDate");
    __decorate([
        typeorm_1.CreateDateColumn({ type: 'datetime', nullable: false })
    ], Task.prototype, "createdAt");
    __decorate([
        typeorm_1.UpdateDateColumn({ type: 'datetime', nullable: false })
    ], Task.prototype, "updatedAt");
    __decorate([
        typeorm_1.OneToMany(function () { return comment_entity_1.Comment; }, function (comment) { return comment.task; })
    ], Task.prototype, "comments");
    __decorate([
        typeorm_1.ManyToOne(function () { return column_entity_1.ColumnEntity; }, function (column) { return column.tasks; }, {
            onDelete: 'CASCADE'
        }),
        typeorm_1.JoinColumn({ name: 'columnId' })
    ], Task.prototype, "column");
    __decorate([
        typeorm_1.ManyToOne(function () { return user_entity_1.User; }, function (user) { return user.task; }, { onDelete: 'CASCADE' }),
        typeorm_1.JoinColumn({ name: 'userId' })
    ], Task.prototype, "user");
    __decorate([
        class_validator_1.IsEnum(task_types_1.Worker),
        typeorm_1.Column({ type: 'enum', "enum": task_types_1.Worker, nullable: true, "default": task_types_1.Worker.User })
    ], Task.prototype, "worker");
    Task = __decorate([
        typeorm_1.Entity('task')
    ], Task);
    return Task;
}());
exports.Task = Task;
