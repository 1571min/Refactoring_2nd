import playsDummy from '../plays.json'
import { plainToClass } from 'class-transformer'
import { Invoice, PerformanceT, Play, Plays } from '../types/chapter1.type'

const plays = plainToClass(Plays, playsDummy)

function playFor(perf: PerformanceT) {
  const play = plays[perf.playID]
  return play
}

export const statementAfter = (invoice: Invoice): string => {
  let totalAmount = 0
  let volumeCredit = 0
  let result = `청구 내역 (고객명: ${invoice.customer})\n`
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format

  for (const perf of invoice.performances) {
    const thisAmount = amountFor(perf, playFor(perf))
    volumeCredit += Math.max(perf.audience - 30, 0)
    if ('comedy' == playFor(perf).type) volumeCredit += Math.floor(perf.audience / 5)
    result += ` * ${playFor(perf).name}: ${format(thisAmount / 100)}(${perf.audience}석)\n`
    totalAmount += thisAmount
  }
  result += `총액: ${format(totalAmount / 100)}\n`
  result += `적립 포인트: ${volumeCredit} 점\n`

  return result
}

const amountFor = (aPerformance: PerformanceT, play: Play) => {
  let thisAmount = 0
  switch (play.type) {
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
      throw new Error(`알 수 없는 장르:  ${play.type}`)
  }
  return thisAmount
}
