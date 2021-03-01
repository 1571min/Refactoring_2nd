"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (invoice, plays) {
    // 계산 단계 분리를 위한 계층 쪼개기
    var playFor = function (perf) {
        return plays[perf.playID];
    };
    var amountFor = function (aPerformance) {
        var result = 0;
        console.log(aPerformance.play);
        switch (aPerformance.play.type) {
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
                throw new Error("\uC54C \uC218 \uC5C6\uB294 \uC7A5\uB974:  " + aPerformance.play.type);
        }
        return result;
    };
    var volumeCreditsFor = function (perf) {
        var result = 0;
        result += Math.max(perf.audience - 30, 0);
        // 희극 관객 5명마다 추가 포인트를 제공한다.
        if ('comedy' == perf.play.type)
            result += Math.floor(perf.audience / 5);
        return result;
    };
    var enrichPerformance = function (aPerformance) {
        var result = Object.assign({}, aPerformance); // 얕은 복사로 전달
        result.play = playFor(result);
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    };
    var totalVolumeCredits = function (data) {
        return data.performances.reduce(function (total, p) { return total + p.volumeCredits; }, 0);
    };
    var totalAmount = function (data) {
        return data.performances.reduce(function (total, p) { return total + p.amount; }, 0);
    };
    var result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformance);
    result.totalAmount = totalAmount(result);
    result.totalVolumeCredits = totalVolumeCredits(result);
    return result;
});
