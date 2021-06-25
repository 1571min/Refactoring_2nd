import { describe } from 'mocha'
import { expect } from 'chai'
import { Province } from './Province'

function sampleProvinceData() {
  return {
    name: 'Asia',
    producers: [
      { name: 'Bynzantium', cost: 10, production: 9 },
      { name: 'Attalia', cost: 12, production: 10 },
      { name: 'sinope', cost: 10, production: 6 }
    ],
    demand: 30,
    price: 20
  }
}

describe('province', () => {
  let asia: Province

  beforeEach(() => {
    asia = new Province(sampleProvinceData())
  })
  it('shortfall', () => {
    expect(asia.shortfall).equal(5)
  })

  it('profit', () => {
    expect(asia.profit).equal(230)
  })

  it('change production', () => {
    asia.producers[0].production = 20
    expect(asia.shortfall).equal(-6)
    expect(asia.profit).equal(292)
  })

  it('zero demand', () => {
    asia.demand = 0
    expect(asia.shortfall).equal(-25)
    expect(asia.profit).equal(0)
  })

  it('empty string demand', () => {
    asia.demand = ''
    // 자바스크립트 특성상 문자열과 연산 시도
    expect(asia.shortfall).equal(-25)
    expect(asia.profit).equal(0)
  })
})

describe('no producer', () => {
  let noProducers: Province
  beforeEach(() => {
    const data = {
      name: 'No producers',
      producers: [],
      demand: 30,
      price: 20
    }
    noProducers = new Province(data)
  })
  it('shortfall', () => {
    expect(noProducers.shortfall).equal(30)
  })

  it('profit', () => {
    expect(noProducers.profit).equal(0)
  })
})
