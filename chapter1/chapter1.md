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

### 다형성 적용

