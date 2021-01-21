```ts
function useOperation(params: {
  id: string,
  broadcastWhen: 'always' | 'unmounted' | 'none',
  pipe: [
    (T1, { AbortSignal }) => T2,
    (T2, { AbortSignal }) => Promise<T3>,
    (T3, { AbortSignal }) => Observable<T4>,
    [ (T4, { AbortSignal }) => Promise<T5>, (T4, { AbortSignal }) => Promise<T6> ],
    ([ T5, T6 ], { AbortSignal }) => T7,
    (T7, { AbortSignal }) => AsyncIterator<Partial<T8>, T8>,
  ],
  renderBroadcast: (props: { 
    status: 'ready' | 'in-progress' | 'done' | 'error',
    // in-progress
    abort: () => void, // timer stop, stop process, remove render
    // done
    data: T8,
    snapshot: [T1, T2, T3, T4, [T5, T6], T7, T8],
    close: () => void, // timer stop, remove render
  }) => ReactNode,
  breakOnError?: true | ((error: unknown) => boolean),
})
```

# 사용자 중단 시나리오 (사용자에게 알리지 않고, 종료 및 초기화)

1. 사용자가 abort() 를 누름
2. withAbortSignal()에서 Event를 받아서 throw
3. useOperation() 에서 catch
   1. Context 쪽으로 stopBroadcast(id) 실행
   2. Context 에서 이미 broadcasting 된 rendering이 있다면 제거
4. useOperation() 의 catch 블록에서 모든 state를 초기화 하면서 종료

# Operator 중단 시나리오 (사용자에게 알리지 않고, 종료 및 초기화)

1. Operator 내부에서 throw new OperationAbort() 실행
2. useOperatin() 에서 catch
   1. Context 쪽으로 stopBroadcast(id) 실행
   2. Context 에서 이미 broadcating 된 rendering이 있다면 제거
4. useOperation() 의 catch 블록에서 모든 state를 초기화 하면서 종료

# Operator 에러 시나리오 (사용자에게 알림)

1. Operator 내부에서 throw <Error>() 실행
2. useOperation() 에서 catch
   1. renderBroadcast() 를 통해서 ReactNode 생성
   2. Context 쪽으로 broadcast(id, ReactNode) 실행
   3. Context 에서 broadcastedRenderings 업데이트
   4. broadcastedRenderings 를 Watch 하고 있는 Component 에서 출력
      1. 출력 시간은 해당 Component가 자유롭게 설정
      2. 출력 시간이 끝났다 싶으면 Context 쪽으로 stopBroadcast(id) 실행

# Operation Timeout

```ts
const [ query ] = useOperation({
  pipe: [
    fabricateRepay,
    withTimeout(postWallet, 1000), // OperationTimeoutError
    waitForBlockCreation,
    parseTxInfo,
  ]
})
```

# Sample Operators Composition

```ts
const [ query ] = useOperation({
  pipe: [
    fabricateRepay, // Param => Msg[] throws Error
    postWallet, // Msg[] => TxResult throws UserDenied, Error
    waitForBlockCreation, // TxResult => TxInfo throws TxFailed
    parseTxInfo, // TxInfo => Result
  ]
})

query(...FabricateRepayArguments)
```