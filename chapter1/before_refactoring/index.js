"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statementBefore = void 0;
var statementBefore = function (invoice, plays) {
    var totalAmount = 0;
    var volumeCredit = 0;
    var result = "\uCCAD\uAD6C \uB0B4\uC5ED (\uACE0\uAC1D\uBA85: " + invoice.customer + ")\n";
    var format = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format;
    for (var _i = 0, _a = invoice.performances; _i < _a.length; _i++) {
        var perf = _a[_i];
        var play = plays[perf.playID];
        var thisAmount = 0;
        switch (play.type) {
            case 'tragedy':
                thisAmount = 40000;
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                }
                break;
            case 'comedy':
                thisAmount = 30000;
                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300 * perf.audience;
                break;
            default:
                throw new Error("\uC54C \uC218 \uC5C6\uB294 \uC7A5\uB974:  " + play.type);
        }
        volumeCredit += Math.max(perf.audience - 30, 0);
        if ('comedy' == play.type)
            volumeCredit += Math.floor(perf.audience / 5);
        result += " * " + play.name + ": " + format(thisAmount / 100) + "(" + perf.audience + "\uC11D)\n";
        totalAmount += thisAmount;
    }
    result += "\uCD1D\uC561: " + format(totalAmount / 100) + "\n";
    result += "\uC801\uB9BD \uD3EC\uC778\uD2B8: " + volumeCredit + " \uC810\n";
    return result;
};
exports.statementBefore = statementBefore;
