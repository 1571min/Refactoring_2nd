import { Invoice, PerformanceT, Play, Plays } from '../types/chapter1.type'

export const statementAfter = (invoice: Invoice, plays: Plays): string => {
  let totalAmount = 0
  let volumeCredits = 0
  let result = `청구 내역 (고객명: ${invoice.customer})\n`

  // 임시 변수를 함수로 바꾸기
  const format = (aNumber: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(aNumber)
  }

  // 임시 변수를 질의 함수로 바꾸기
  const playFor = (perf: PerformanceT): Play => {
    const play = plays[perf.playID]
    return play
  }

  // 함수 추출 하기
  const amountFor = (aPerformance: PerformanceT) => {
    let thisAmount = 0
    switch (playFor(aPerformance).type) {
      case 'tragedy':
        thisAmount = 40000
        if (aPerformance.audience > 30) {
          thisAmount += 1000 * (aPerformance.audience - 30)
        }
        break
      case 'comedy':
        thisAmount = 30000
        if (aPerformance.audience > 20) {
          thisAmount += 10000 + 500 * (aPerformance.audience - 20)
        }
        thisAmount += 300 * aPerformance.audience
        break
      default:
        throw new Error(`알 수 없는 장르:  ${playFor(aPerformance).type}`)
    }
    return thisAmount
  }

  // 계산 코드 추출 하기
  const volumeCreditsFor = (perf: PerformanceT): number => {
    let volumeCredits = 0
    volumeCredits += Math.max(perf.audience - 30, 0)
    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ('comedy' == playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5)
    return volumeCredits
  }

  for (const perf of invoice.performances) {
    // 포인트를 적립한다.
    volumeCredits += volumeCreditsFor(perf)
    // 청구 내역을 출력한다
    result += ` * ${playFor(perf).name}: ${format(amountFor(perf) / 100)}(${perf.audience}석)\n`
    totalAmount += amountFor(perf)
  }
  result += `총액: ${format(totalAmount / 100)}\n`
  result += `적립 포인트: ${volumeCredits} 점\n`

  return result
}
