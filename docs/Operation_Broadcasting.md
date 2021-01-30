# Operation Broadcasting

1. 화면 내에서 Transaction 요청
2. 화면 내에서 Chrome Extension의 Transaction 결과 대기
3. 화면 이탈, 대기 상태 해제됨
4. Chrome Extension 에서 Transaction 처리됨
5. 결과를 Web Site 내에서 확인할 수 없음

위와 같은 구조를 해결하기 위해서 별개의 Library를 만들어서 사용한다.

이왕 Library를 만드는 김에 기능 단위를 Pure Function으로 만들고 Pipe Composition 할 수 있는 형태로 제작되었다.

<!-- source ../packages/src/@anchor-protocol/broadcastable-operation/__stories__/broadcast.stories.tsx -->

[../packages/src/@anchor-protocol/broadcastable-operation/\_\_stories\_\_/broadcast.stories.tsx](../packages/src/@anchor-protocol/broadcastable-operation/__stories__/broadcast.stories.tsx)

```tsx
import {
  createBroadcastingOption,
  createOperationOptions,
  OperationBroadcaster,
  useBroadcasting,
  useOperation,
} from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import React, { ComponentType } from 'react';
import { FloatingContainer } from './fixtures/FloatingContainer';
import { lazy } from './fixtures/lazy';

export default {
  title: 'core/broadcastable-operation',
  decorators: [
    (Story: ComponentType) => (
      <OperationBroadcaster dependency={{}}>
        <Story />
        <Container />
      </OperationBroadcaster>
    ),
  ],
};

const operationOptions = createOperationOptions({
  broadcastWhen: 'always',
  pipe: ({ a }: { a: number }) => [
    (x: number) => lazy(x.toString(), 3000),
    (y: string) => lazy(parseInt(y) + a, 3000),
    (z: number) => lazy(z.toString(), 3000),
  ],
  renderBroadcast: (result) => {
    return <pre>{JSON.stringify(result, null, 2)}</pre>;
  },
});

const broadcastingOptions = createBroadcastingOption({
  map: ({ id, rendering }) => <li key={id}>{rendering}</li>,
  displayTime: 5000,
});

function Container() {
  const renderings = useBroadcasting(broadcastingOptions);
  return <FloatingContainer>{renderings}</FloatingContainer>;
}

export const Always_Broadcast = () => {
  const [operate1] = useOperation(operationOptions, { a: 30 });
  const [operate2] = useOperation(operationOptions, { a: 50 });

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <ActionButton
        style={{ width: 200 }}
        onClick={() => operate1(Math.floor(Math.random() * 100))}
      >
        Operation 1
      </ActionButton>
      <ActionButton
        style={{ width: 200 }}
        onClick={() => operate2(Math.floor(Math.random() * 100))}
      >
        Operation 2
      </ActionButton>
    </div>
  );
};
```

<!-- /source -->

# ??? husky test...
