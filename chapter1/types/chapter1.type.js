"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invoice = exports.PerformanceT = exports.Plays = exports.Play = void 0;
var Play = /** @class */ (function () {
    function Play(name, type) {
        this.name = name;
        this.type = type;
    }
    return Play;
}());
exports.Play = Play;
var Plays = /** @class */ (function () {
    function Plays() {
    }
    return Plays;
}());
exports.Plays = Plays;
var PerformanceT = /** @class */ (function () {
    function PerformanceT(playId, audience) {
        this.playID = playId;
        this.audience = audience;
    }
    return PerformanceT;
}());
exports.PerformanceT = PerformanceT;
var Invoice = /** @class */ (function () {
    function Invoice(customer, performances) {
        this.customer = customer;
        this.performances = performances;
    }
    return Invoice;
}());
exports.Invoice = Invoice;
