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

export const afterPolymorphismStatement = (invoice: Invoice, plays: Plays): string => {
  return renderPlainText(createStatementData(invoice, plays))
}
