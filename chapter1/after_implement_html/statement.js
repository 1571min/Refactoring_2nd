"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlStatement = exports.statement = void 0;
var createStatementData_1 = __importDefault(require("./createStatementData"));
var usd = function (aNumber) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(aNumber / 100);
};
var renderPlainText = function (data) {
    // 임시 변수를 함수로 바꾸고 함수명 의미에 맞게 rename
    var result = "\uCCAD\uAD6C \uB0B4\uC5ED (\uACE0\uAC1D\uBA85: " + data.customer + ")\n";
    for (var _i = 0, _a = data.performances; _i < _a.length; _i++) {
        var perf = _a[_i];
        // 청구 내역을 출력한다
        result += " * " + perf.play.name + ": " + usd(perf.amount) + "(" + perf.audience + "\uC11D)\n";
    }
    result += "\uCD1D\uC561: " + usd(data.totalAmount) + "\n";
    result += "\uC801\uB9BD \uD3EC\uC778\uD2B8: " + data.totalVolumeCredits + " \uC810\n";
    return result;
};
var renderHtml = function (data) {
    var result = "<h1> \uCCAD\uAD6C \uB0B4\uC5ED ( \uACE0\uAC1D\uBA85: " + data.customer + ") </h1>\n";
    result += '<table>\n';
    result += "<tr><th>\uC5F0\uADF9</th><th>\uC88C\uC11D \uC218</th><th>\uAE08\uC561</th></tr>";
    for (var _i = 0, _a = data.performances; _i < _a.length; _i++) {
        var perf = _a[_i];
        result += "    <tr><td>" + perf.play.name + "</td><td>" + perf.audience + "</td>";
        result += "<td>" + usd(perf.amount) + "</td></tr>\n";
    }
    result += '</table>\n';
    result += "<p>\uCD1D\uC561: <em>" + usd(data.totalAmount) + "</em></p>";
    result += "<p>\uC801\uB9BD \uD3EC\uC778: <em>" + usd(data.totalVolumeCredits) + "</em></p>";
    return result;
};
var statement = function (invoice, plays) {
    return renderPlainText(createStatementData_1.default(invoice, plays));
};
exports.statement = statement;
var htmlStatement = function (invoice, plays) {
    return renderHtml(createStatementData_1.default(invoice, plays));
};
exports.htmlStatement = htmlStatement;
