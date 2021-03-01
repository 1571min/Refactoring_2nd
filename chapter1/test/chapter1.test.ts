import { statementBefore } from '../before_refactoring'
import { statementAfter } from '../after_refactoring'
import { Invoice, Plays } from '../types/chapter1.type'
import { plainToClass } from 'class-transformer'
import playsDummy from '../plays.json'
import invoicesDummy from '../invoices.json'
import { htmlStatement, statement } from '../after_implement_html/statement'

const plays = plainToClass(Plays, playsDummy)
const invoice = plainToClass(Invoice, invoicesDummy[0])

describe('refactoring test', () => {
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
})
