import { Invoice, PerformanceT, Play, Plays } from '../types/chapter1.type'
import { Statement } from './statement'

class PerformanceCalculator {
  performance: PerformanceT
  play: Play
  constructor(aPerformace: PerformanceT, aPlay: Play) {
    this.performance = aPerformace
    this.play = aPlay
  }
}

export default (invoice: Invoice, plays: Plays) => {
  // 계산 단계 분리를 위한 계층 쪼개기
  const playFor = (perf: PerformanceT): Play => {
    return plays[perf.playID]
  }

  const amountFor = (aPerformance: PerformanceT): number => {
    let result = 0
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
    const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance))
    const result = Object.assign({}, aPerformance) // 얕은 복사로 전달
    result.play = calculator.play
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

  const result = {} as Statement
  result.customer = invoice.customer
  result.performances = invoice.performances.map(enrichPerformance)
  result.totalAmount = totalAmount(result)
  result.totalVolumeCredits = totalVolumeCredits(result)

  return result
}
