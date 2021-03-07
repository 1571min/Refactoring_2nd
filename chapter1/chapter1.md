첫번째 쳅터는 앞으로 다루게 될 앞으로의 리팩터링 내용들을 가볍게 훑고 지나가는 챕터이다

### 함수 추출하기

함수 추출하기란 말 그대로 코드 조각을 함수로 추출하는 과정을 의미한다 함수로 추출할 때 변수의 유효 범위를 체크 해야한다 유효범위를 벗어나는 변수는 매개변수로 전달하고 함수 내부에서 변하는 변수는 리턴 값으로 정한다

### 리팩터링의 과정

리팩터링은 기존의 코드를 효율적인 구조로 바꾸는 것이기 때문에  기존의 기능이 제대로 작동하는 지 테스트 하는 것이 중요하다 그래서 리팩터링 하기 위해서 필수로 테스트를 작성한다 이제 리팩터링 과정을 매우 작은 단위로 쪼개서 리팩터링 ⇒ 테스트 ⇒ 리팩터링 ⇒ 테스트 ⇒ ... 이 과정은 반복한다 이렇게 하는 것이 추후의 디버깅 시간을 줄여주는 중요한 부분이다

> 함수에서  return 변수의 이름을 result로 통일하면 구분하기 편하다

### 임시변수를 질의 함수로 바꾸기

다른 변수로 부터 저장한 임시 변수가 많아지면 함수 추출과정이 복잡해지기 때문에 이를 질의함수로 바꾸고 기존에 변수가 사용되는 곳을 인라인 변수로 바꾼다 이를 잘 적용하면 추출하는 함수로 전해줘야 될 매개변수도 줄일 수 있는 가능성이 있다

### 반복문 쪼개기 후 함수 추출하기

하나의 반복문에서 여러가지를 수행하는 경우 반복문 내부 기능을 추출하기 위해서 반복문을 쪼개야 한다 그러나 이는 반복문은 한번더 써야한다는 점 속도를 느리게 할 수 있지만 생각보다 그렇게 많이 느려지지 않고 좀 더 깔끔하게 개선된 코드를 통해서 성능 개선을 효율적으로 진행 할 수 있다는 장점이 있다

* before

```javascript
for (const perf of invoice.performances) {
    // 포인트를 적립한다.
    volumeCredits += volumeCreditsFor(perf)
    // 청구 내역을 출력한다
    result += ` * ${playFor(perf).name}: ${usd(amountFor(perf))}(${perf.audience}석)\n`
    totalAmount += amountFor(perf)
  }
  result += `총액: ${usd(totalAmount)}\n`
  result += `적립 포인트: ${volumeCredits} 점\n`
```
* after
```javascript
  // 반복문 쪼개기 후 함수로 추출
  const totalVolumeCredit = () => {
    let volumeCredits = 0
    for (const perf of invoice.performances) {
      // 포인트를 적립한다.
      volumeCredits += volumeCreditsFor(perf)
    }
    return volumeCredits
  }

  for (const perf of invoice.performances) {
    // 청구 내역을 출력한다
    result += ` * ${playFor(perf).name}: ${usd(amountFor(perf))}(${perf.audience}석)\n`
    totalAmount += amountFor(perf)
  }

  result += `총액: ${usd(totalAmount)}\n`
  result += `적립 포인트: ${totalVolumeCredit()} 점\n`
```
### 단계 쪼개기

이 부분에서는 비슷한 역할을 하는 부분을 하나의 단계로 처리하고 해당 단계에서 나온 중간 데이터를 다음 단계로 전달해주는 구조이다 이는 추후 하나의 단계가 여러 방식으로 응용될 수 있다는 장점이 있다

### 조건부 로직 다형성으로 바꾸기 ([전체 코드](https://github.com/1571min/Refactoring_2nd/blob/master/chapter1/after_polymorphism/createStatementData.ts))
어떤 조건에 따라 다르게 작동하는 로직을 객체지향을 이용해서 하나의 상위 클래스를 만들고 해당 클래스를 상속하는 여러 자식 클래스를 만들어서 조건부 로직을 대체 하는 방식이다 
이 책에서는 조건부 처리를 위해서 팩토리 패턴을 이용해서 해당하는 타입에 따라 자식클래스 생성하는 방식으로 설계했

* before
```typescript
  const amountFor = (aPerformance: PerformanceT): number => {
    let result = 0
    switch (aPerformance.play.type) {
      case 'tragedy':
        result = 40000
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30)
        }
        break
      case 'comedy':
        result = 30000
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20)
        }
        result += 300 * aPerformance.audience
        break
      default:
        throw new Error(`알 수 없는 장르:  ${aPerformance.play.type}`)
    }
    return result
  }

  const volumeCreditsFor = (perf: PerformanceT): number => {
    let result = 0
    result += Math.max(perf.audience - 30, 0)
    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ('comedy' == perf.play.type) result += Math.floor(perf.audience / 5)
    return result
  }

  const enrichPerformance = (aPerformance: PerformanceT): PerformanceT => {
    const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance))
    const result = Object.assign({}, aPerformance) // 얕은 복사로 전달
    result.play = calculator.play
    result.amount = amountFor(result)
    result.volumeCredits = volumeCreditsFor(result)
    return result
  }
```

* after
```typescript
class PerformanceCalculator {
  performance: PerformanceT
  play: Play
  constructor(aPerformance: PerformanceT, aPlay: Play) {
    this.performance = aPerformance
    this.play = aPlay
  }

  // amountFor 함수 옮기기 후 함수 인라인
  get amount() {
    return 0
  }

  // volumeCreditsFor 함수 옮기기 후 함수 인라인
  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0)
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30)
    }
    return result
  }
}
class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20)
    }
    return (result += 300 * this.performance.audience)
  }

  get volumeCredits() {
    // 희극 관객 5명마다 추가 포인트를 제공한다.
    return super.volumeCredits + Math.floor(this.performance.audience / 5)
  }
}

const createPerformanceCalculator = (aPerformance: PerformanceT, aPlay: Play) => {
  switch (aPlay.type) {
    case 'tragedy':
      return new TragedyCalculator(aPerformance, aPlay)
    case 'comedy':
      return new ComedyCalculator(aPerformance, aPlay)
    default:
      throw new Error(`알 수 없는 장르: ${aPlay.type}`)
  }
}

const enrichPerformance = (aPerformance: PerformanceT): PerformanceT => {
  const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance))
  const result = Object.assign({}, aPerformance) // 얕은 복사로 전달
  result.play = calculator.play
  result.amount = calculator.amount
  result.volumeCredits = calculator.volumeCredits
  return result
}
```


### 좋은 코드란?
좋은 코드에 대한 기준에 대해 개인적인 미적인 취향은 존재 할 수 있고 이는 누구나 다를 수 있지만 취향을 넘어선 관점이
존재한다 그것은 `수정하기 쉬운 정도` 를 기준으로 하는 것이다 
