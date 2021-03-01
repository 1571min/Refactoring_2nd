"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statementAfter = void 0;
var statementAfter = function (invoice, plays) {
    // 임시 변수를 함수로 바꾸고 함수명 의미에 맞게 rename
    var usd = function (aNumber) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(aNumber / 100);
    };
    // 임시 변수를 질의 함수로 바꾸기
    var playFor = function (perf) {
        return plays[perf.playID];
    };
    // 함수 추출 하기
    var amountFor = function (aPerformance) {
        var result = 0;
        switch (playFor(aPerformance).type) {
            case 'tragedy':
                result = 40000;
                if (aPerformance.audience > 30) {
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;
            case 'comedy':
                result = 30000;
                if (aPerformance.audience > 20) {
                    result += 10000 + 500 * (aPerformance.audience - 20);
                }
                result += 300 * aPerformance.audience;
                break;
            default:
                throw new Error("\uC54C \uC218 \uC5C6\uB294 \uC7A5\uB974:  " + playFor(aPerformance).type);
        }
        return result;
    };
    // 계산 코드 추출 하기
    var volumeCreditsFor = function (perf) {
        var result = 0;
        result += Math.max(perf.audience - 30, 0);
        // 희극 관객 5명마다 추가 포인트를 제공한다.
        if ('comedy' == playFor(perf).type)
            result += Math.floor(perf.audience / 5);
        return result;
    };
    // 반복문 쪼개기 후 함수로 추출
    var totalVolumeCredit = function () {
        var result = 0;
        for (var _i = 0, _a = invoice.performances; _i < _a.length; _i++) {
            var perf = _a[_i];
            // 포인트를 적립한다.
            result += volumeCreditsFor(perf);
        }
        return result;
    };
    var totalAmount = function () {
        var result = 0;
        for (var _i = 0, _a = invoice.performances; _i < _a.length; _i++) {
            var perf = _a[_i];
            result += amountFor(perf);
        }
        return result;
    };
    var result = "\uCCAD\uAD6C \uB0B4\uC5ED (\uACE0\uAC1D\uBA85: " + invoice.customer + ")\n";
    for (var _i = 0, _a = invoice.performances; _i < _a.length; _i++) {
        var perf = _a[_i];
        // 청구 내역을 출력한다
        result += " * " + playFor(perf).name + ": " + usd(amountFor(perf)) + "(" + perf.audience + "\uC11D)\n";
    }
    result += "\uCD1D\uC561: " + usd(totalAmount()) + "\n";
    result += "\uC801\uB9BD \uD3EC\uC778\uD2B8: " + totalVolumeCredit() + " \uC810\n";
    return result;
};
exports.statementAfter = statementAfter;
