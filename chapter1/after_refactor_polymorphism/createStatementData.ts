import { Invoice, PerformanceT, Play, Plays } from '../types/chapter1.type'
import { Statement } from './statement'

class PerformanceCalculator {
  performance: PerformanceT
  play: Play
  constructor(aPerformance: PerformanceT, aPlay: Play) {
    this.performance = aPerformance
    this.play = aPlay
  }

  // amountFor 함수 옮기기 후 함수 인라인
  get amount() {
    let result = 0
    switch (this.play.type) {
      case 'tragedy':
        result = 40000
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30)
        }
        break
      case 'comedy':
        result = 30000
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20)
        }
        result += 300 * this.performance.audience
        break
      default:
        throw new Error(`알 수 없는 장르:  ${this.play.type}`)
    }
    return result
  }

  // volumeCreditsFor 함수 옮기기 후 함수 인라인
  get volumeCredits() {
    let result = 0
    result += Math.max(this.performance.audience - 30, 0)
    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ('comedy' == this.play.type) result += Math.floor(this.performance.audience / 5)
    return result
  }
}

export default (invoice: Invoice, plays: Plays) => {
  // 계산 단계 분리를 위한 계층 쪼개기
  const playFor = (perf: PerformanceT): Play => {
    return plays[perf.playID]
  }

  const enrichPerformance = (aPerformance: PerformanceT): PerformanceT => {
    const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance))
    const result = Object.assign({}, aPerformance) // 얕은 복사로 전달
    result.play = calculator.play
    result.amount = calculator.amount
    result.volumeCredits = calculator.volumeCredits
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
