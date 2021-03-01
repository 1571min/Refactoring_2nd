export class Play {
  constructor(name: string, type: string) {
    this.name = name
    this.type = type
  }
  name: string
  type: string
}

export interface PlaysInterface {
  [key: string]: Play
}

export class Plays implements PlaysInterface {
  [key: string]: Play
}

export class PerformanceT {
  constructor(playId: string, audience: number) {
    this.playID = playId
    this.audience = audience
  }
  playID: string
  audience: number
  play!: Play
  amount!: number
  volumeCredits!: number
}

export class Invoice {
  constructor(customer: string, performances: PerformanceT[]) {
    this.customer = customer
    this.performances = performances
  }
  customer: string
  performances: PerformanceT[]
}
