import { statementBefore } from '../before_refactoring'
import { statementAfter } from '../after_refactoring'
import { Invoice, Plays } from '../types/chapter1.type'
import { plainToClass } from 'class-transformer'
import playsDummy from '../plays.json'
import invoicesDummy from '../invoices.json'

const plays = plainToClass(Plays, playsDummy)
const invoice = plainToClass(Invoice, invoicesDummy[0])

test('refactoring success', () => {
  const after = statementAfter(invoice, plays)
  const before = statementBefore(invoice, plays)
  expect(after).toBe(before)
})
