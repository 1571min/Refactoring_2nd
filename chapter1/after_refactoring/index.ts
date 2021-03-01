import { Invoice, PerformanceT, Play, Plays } from '../types/chapter1.type'

export const statementAfter = (invoice: Invoice, plays: Plays): string => {
  let result = `청구 내역 (고객명: ${invoice.customer})\n`

  // 임시 변수를 함수로 바꾸고 함수명 의미에 맞게 rename
  const usd = (aNumber: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(aNumber / 100)
  }

  // 임시 변수를 질의 함수로 바꾸기
  const playFor = (perf: PerformanceT): Play => {
    return plays[perf.playID]
  }

  // 함수 추출 하기
  const amountFor = (aPerformance: PerformanceT) => {
    let result = 0
    switch (playFor(aPerformance).type) {
      case 'tragedy':
        result = 40000
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30)
        }
        break
      case 'comedy':
        result = 30000
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20)
        }
        result += 300 * aPerformance.audience
        break
      default:
        throw new Error(`알 수 없는 장르:  ${playFor(aPerformance).type}`)
    }
    return result
  }

  // 계산 코드 추출 하기
  const volumeCreditsFor = (perf: PerformanceT): number => {
    let result = 0
    result += Math.max(perf.audience - 30, 0)
    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ('comedy' == playFor(perf).type) result += Math.floor(perf.audience / 5)
    return result
  }

  // 반복문 쪼개기 후 함수로 추출
  const totalVolumeCredit = () => {
    let result = 0
    for (const perf of invoice.performances) {
      // 포인트를 적립한다.
      result += volumeCreditsFor(perf)
    }
    return result
  }
  const totalAmount = () => {
    let result = 0
    for (const perf of invoice.performances) {
      result += amountFor(perf)
    }
    return result
  }

  for (const perf of invoice.performances) {
    // 청구 내역을 출력한다
    result += ` * ${playFor(perf).name}: ${usd(amountFor(perf))}(${perf.audience}석)\n`
  }

  result += `총액: ${usd(totalAmount())}\n`
  result += `적립 포인트: ${totalVolumeCredit()} 점\n`

  return result
}
