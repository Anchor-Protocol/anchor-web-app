# Operation Broadcasting

1. 화면 내에서 Transaction 요청
2. 화면 내에서 Chrome Extension의 Transaction 결과 대기
3. 화면 이탈 (Unmount), 대기 상태 해제됨
4. Chrome Extension 에서 Transaction 처리됨
5. 결과를 Web Site 내에서 확인할 수 없음

위와 같은 구조를 해결하기 위해서 별개의 Framework(`@anchor-protocol/broadcastable-operation`)을 만들어서 사용한다.

1. 화면 내에서 Transaction 요청
2. 화면 내에서 Chrome Extension의 Transaction 결과 대기
3. 화면 이탈 시 (Unmount) `<OperationBroadcaster>` 에서 결과를 대신 대기함
4. Chrome Extension 에서 Transaction 처리됨
5. `<OperationBroadcaster>` 에서 결과를 받아서 `Snackbar` 또는 `Alert` 과 같은 기능들을 통해 사용자에게 알림

위와 같이 사용자가 화면 내에서 체류 중인 상황에서는 기존 방식대로 결과를 화면에 출력하고,
사용자가 화면을 이탈하는 경우에는 전역적인 알림으로 대체하게 된다.

부차적으로 기능 단위를 Pure Function으로 만들고 Composition 할 수 있는 형태로 제작되었다.
(Ramda, Rx 등의 Pipe Composition과 유사)

## 구성

Provider 설정 (전역 관리자)

```tsx
import { OperationBroadcaster } from '@anchor-protocol/broadcastable-operation';

function App() {
  return (
    // Operation을 관리하는 Provider를 제공해줘야 한다
    // dependency 에 입력된 항목들은 개별 Operation의 실행 시 제공되는 전역 의존성이 된다
    <OperationBroadcaster dependency={{ global: 10 }}>
      {/* TODO */}
    </OperationBroadcaster>
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));
```

Operation 설정 (송신부)

```tsx
import {
  useBroadcasting,
  createBroadcastingOption,
  OperationDependency,
} from '@anchor-protocol/broadcastable-operation';

const operationOptions = createOperationOptions({
  pipe: ({ a }: OperationDependency<{ a: number }>) => [
    (x: number) => lazy(x.toString(), 3000),
    (y: string) => lazy(parseInt(y) + a, 3000),
    (z: number) => lazy(z.toString(), 3000),
  ],
  renderBroadcast: (result) => {
    return <pre>{JSON.stringify(result, null, 2)}</pre>;
  },
});

function Component() {
  // exec() 이 실행된 이후
  // 현재 Component가 Mount 되어 있는 동안에는 result 를 통해 화면에 결과를 출력할 수 있다
  // exec() 이 진행되는 상황에서 Component가 Unmount 되면 result 는 <OperationBroadcaster/> 를 통해 전역적으로 Broadcasting 된다.
  const [exec, result] = useOperation(operationOptions, { a: 30 });

  return (
    <div>
      {/*
       * exec() 의 실행 결과는 pipe에 선언된 Function들의 실행 순서와 OperationDependency<{a: 30}> 에 의해서
       * 100 -> '100' -> 130 -> '130' 이 된다.
       */}
      <button onClick={() => exec(100)}>Execute Operation</button>
    </div>
  );
}
```

Broadcast 되는 Result 들을 화면에 렌더링하기 (수신부)

```tsx
import {
  useBroadcasting,
  createBroadcastingOption,
} from '@anchor-protocol/broadcastable-operation';

const broadcastingOption = createBroadcastingOption({
  map: ({ id, rendering }) => <li key={id}>{rendering}</li>,
  displayTime: 5000,
});

function BroadcatingRenderer() {
  // Broadcast 된 Operation 결과물들을 화면에 출력할 수 있다.
  const renderings = useBroadcasting(broadcastingOption);

  return (
    <div style={{ position: 'fixed', right: 0, bottom: 0 }}>
      <ul>{renderings}</ul>
    </div>
  );
}
```

위와 같이 전역 관리 (`<OperationBroadcaster/>`), 송신 (`useOperation()`), 수신 (`useBroadcasting()`) 의 3가지 구성 요소들을 조합해서 설정하게 된다.
