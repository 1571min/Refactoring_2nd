import { Invoice, PerformanceT, Plays } from '../types/chapter1.type'
import createStatementData from './createStatementData'
export type Statement = {
  totalVolumeCredits: number
  totalAmount: number
  customer: string
  performances: PerformanceT[]
}
const usd = (aNumber: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(aNumber / 100)
}

const renderPlainText = (data: Statement) => {
  // 임시 변수를 함수로 바꾸고 함수명 의미에 맞게 rename
  let result = `청구 내역 (고객명: ${data.customer})\n`
  for (const perf of data.performances) {
    // 청구 내역을 출력한다
    result += ` * ${perf.play.name}: ${usd(perf.amount)}(${perf.audience}석)\n`
  }

  result += `총액: ${usd(data.totalAmount)}\n`
  result += `적립 포인트: ${data.totalVolumeCredits} 점\n`

  return result
}

const renderHtml = (data: Statement) => {
  let result = `<h1> 청구 내역 ( 고객명: ${data.customer}) </h1>\n`
  result += '<table>\n'
  result += `<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>`
  for (const perf of data.performances) {
    result += `    <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`
    result += `<td>${usd(perf.amount)}</td></tr>\n`
  }
  result += '</table>\n'
  result += `<p>총액: <em>${usd(data.totalAmount)}</em></p>`
  result += `<p>적립 포인: <em>${usd(data.totalVolumeCredits)}</em></p>`
  return result
}

export const statement = (invoice: Invoice, plays: Plays): string => {
  return renderPlainText(createStatementData(invoice, plays))
}

export const htmlStatement = (invoice: Invoice, plays: Plays): string => {
  return renderHtml(createStatementData(invoice, plays))
}
