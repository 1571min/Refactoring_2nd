export class Producer {
  get name(): string {
    return this._name
  }

  set name(value: string) {
    this._name = value
  }

  get cost(): number {
    return this._cost
  }

  set cost(value: number) {
    this._cost = value
  }

  get production(): number {
    return this._production
  }

  set production(value: number) {
    const newProduction = Number.isNaN(value) ? 0 : value
    this._province.totalProduction += newProduction - this.production
    this._production = newProduction
  }
  constructor(aProvince: Province, data: any) {
    this._province = aProvince
    this._cost = data.cost
    this._name = data.name
    this._production = data.production || 0
  }

  private _name!: string
  private _cost!: number
  private _production!: number
  private _province!: Province
}

export class Province {
  get name(): any {
    return this._name
  }

  set name(value: any) {
    this._name = value
  }

  get producers(): any[] {
    return this._producers
  }

  set producers(value: any[]) {
    this._producers = value
  }

  get totalProduction(): number {
    return this._totalProduction
  }

  set totalProduction(value: number) {
    this._totalProduction = value
  }

  get demand(): any {
    return this._demand
  }

  set demand(value: any) {
    this._demand = value
  }

  get price(): any {
    return this._price
  }

  set price(value: any) {
    this._price = value
  }

  get shortfall() {
    console.log(this._demand)
    console.log(this.totalProduction)
    return this._demand - this.totalProduction
  }
  get profit() {
    return this.demandValue - this.demandCost
  }
  get demandValue() {
    return this.satisfiedDemand * this.price
  }
  get satisfiedDemand() {
    return Math.min(this._demand, this.totalProduction)
  }
  get demandCost() {
    let remainingDemand = this.demand
    let result = 0
    this.producers
      .sort((a, b) => a.cost - b.cost)
      .forEach((p: Producer) => {
        const contribution = Math.min(remainingDemand, p.production)
        remainingDemand -= contribution
        result += contribution * p.cost
      })
    return result
  }

  private _name: any
  private _producers: any[]
  private _totalProduction: number
  private _demand: any
  private _price: any

  constructor(doc: any) {
    this._name = doc.name
    this._producers = []
    this._totalProduction = 0
    this._demand = doc.demand
    this._price = doc.price
    doc.producers.forEach((d: Producer) => this.addProducer(new Producer(this, d)))
  }

  private addProducer(producer: Producer) {
    this._producers.push(producer)
    this._totalProduction += producer.production
  }
}
