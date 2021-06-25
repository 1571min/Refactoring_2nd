import { statementBefore } from '../before'
import { statementAfter } from '../after_function'
import { Invoice, Plays } from '../types/chapter1.type'
import { plainToClass } from 'class-transformer'
import playsDummy from '../plays.json'
import invoicesDummy from '../invoices.json'
import { statement } from '../after_implement_html/statement'
import { afterPolymorphismStatement } from '../after_polymorphism/statement'
import createStatementData from '../after_polymorphism/createStatementData'

const plays = plainToClass(Plays, playsDummy)
const invoice = plainToClass(Invoice, invoicesDummy[0])

const createStatementOriginData = {
  customer: 'BigCo',
  performances: [
    {
      playID: 'hamlet',
      audience: 55,
      play: {
        name: 'hamlet',
        type: 'tragedy'
      },
      amount: 65000,
      volumeCredits: 25
    },
    {
      playID: 'aslike',
      audience: 35,
      play: {
        name: 'As You Like It',
        type: 'comedy'
      },
      amount: 58000,
      volumeCredits: 12
    },
    {
      playID: 'othello',
      audience: 40,
      play: {
        name: 'othello',
        type: 'tragedy'
      },
      amount: 50000,
      volumeCredits: 10
    }
  ],
  totalAmount: 173000,
  totalVolumeCredits: 47
}

describe('refactoring test', () => {
  it('middle data format check1 success', () => {
    expect(createStatementData(invoice, plays)).toStrictEqual(createStatementOriginData)
  })

  it('refactoring 1 success', () => {
    console.time('after_refactoring')
    const after = statementAfter(invoice, plays)
    console.timeEnd('after_refactoring')

    console.time('before_refactoring')
    const before = statementBefore(invoice, plays)
    console.timeEnd('before_refactoring')
    expect(after).toBe(before)
  })

  it('implement html part refactoring success', () => {
    console.time('html part_refactoring')
    const htmlPartStatement = statement(invoice, plays)
    console.timeEnd('html part_refactoring')

    console.time('before_refactoring')
    const before = statementBefore(invoice, plays)
    console.timeEnd('before_refactoring')
    expect(htmlPartStatement).toBe(before)
  })

  it('refactoring using polymorphism success', () => {
    console.time('html part_refactoring')
    const polymorphismStatement = afterPolymorphismStatement(invoice, plays)
    console.timeEnd('html part_refactoring')

    console.time('before_refactoring')
    const before = statementBefore(invoice, plays)
    console.timeEnd('before_refactoring')
    expect(polymorphismStatement).toBe(before)
  })
})
