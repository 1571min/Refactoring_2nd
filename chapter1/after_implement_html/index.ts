import { Invoice, PerformanceT, Play, Plays } from '../types/chapter1.type'
type Statement = {
  totalVolumeCredits: number
  totalAmount: number
  customer: string
  performances: PerformanceT[]
}

const renderPlainText = (data: Statement) => {
  // 임시 변수를 함수로 바꾸고 함수명 의미에 맞게 rename
  const usd = (aNumber: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(aNumber / 100)
  }

  let result = `청구 내역 (고객명: ${data.customer})\n`
  for (const perf of data.performances) {
    // 청구 내역을 출력한다
    result += ` * ${perf.play.name}: ${usd(perf.amount)}(${perf.audience}석)\n`
  }

  result += `총액: ${usd(data.totalAmount)}\n`
  result += `적립 포인트: ${data.totalVolumeCredits} 점\n`

  return result
}

export const statement = (invoice: Invoice, plays: Plays): string => {
  // 계산 단계 분리를 위한 계층 쪼개기
  const playFor = (perf: PerformanceT): Play => {
    return plays[perf.playID]
  }

  const amountFor = (aPerformance: PerformanceT): number => {
    let result = 0
    console.log(aPerformance.play)
    switch (aPerformance.play.type) {
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
        throw new Error(`알 수 없는 장르:  ${aPerformance.play.type}`)
    }
    return result
  }

  const volumeCreditsFor = (perf: PerformanceT): number => {
    let result = 0
    result += Math.max(perf.audience - 30, 0)
    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ('comedy' == perf.play.type) result += Math.floor(perf.audience / 5)
    return result
  }

  const enrichPerformance = (aPerformance: PerformanceT): PerformanceT => {
    const result = Object.assign({}, aPerformance) // 얕은 복사로 전달
    result.play = playFor(result)
    result.amount = amountFor(result)
    result.volumeCredits = volumeCreditsFor(result)
    return result
  }

  const totalVolumeCredits = (data: Statement) => {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0)
  }

  const totalAmount = (data: Statement) => {
    return data.performances.reduce((total, p) => total + p.amount, 0)
  }

  const statementData = {} as Statement
  statementData.customer = invoice.customer
  statementData.performances = invoice.performances.map(enrichPerformance)
  statementData.totalAmount = totalAmount(statementData)
  statementData.totalVolumeCredits = totalVolumeCredits(statementData)
  return renderPlainText(statementData)
}
