"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var before_refactoring_1 = require("../before_refactoring");
var after_refactoring_1 = require("../after_refactoring");
var chapter1_type_1 = require("../types/chapter1.type");
var class_transformer_1 = require("class-transformer");
var plays_json_1 = __importDefault(require("../plays.json"));
var invoices_json_1 = __importDefault(require("../invoices.json"));
var statement_1 = require("../after_implement_html/statement");
var plays = class_transformer_1.plainToClass(chapter1_type_1.Plays, plays_json_1.default);
var invoice = class_transformer_1.plainToClass(chapter1_type_1.Invoice, invoices_json_1.default[0]);
describe('refactoring test', function () {
    it('refactoring 1 success', function () {
        console.time('after_refactoring');
        var after = after_refactoring_1.statementAfter(invoice, plays);
        console.timeEnd('after_refactoring');
        console.time('before_refactoring');
        var before = before_refactoring_1.statementBefore(invoice, plays);
        console.timeEnd('before_refactoring');
        expect(after).toBe(before);
    });
    it('implement html part refactoring success', function () {
        console.time('html part_refactoring');
        var htmlPartStatement = statement_1.statement(invoice, plays);
        console.timeEnd('html part_refactoring');
        console.time('before_refactoring');
        var before = before_refactoring_1.statementBefore(invoice, plays);
        console.timeEnd('before_refactoring');
        expect(htmlPartStatement).toBe(before);
    });
    console.log(statement_1.htmlStatement(invoice, plays));
});
