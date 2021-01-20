```ts
function useBroadcastableQuery(params: {
  id: string,
  broadcastWhen: 'always' | 'unmounted' | 'none',
  operationTimeout?: number,
  showFor?: number,
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

```tsx
const { elements } = useBroadcastedElements()

return <div>{elements}</div>
```

```ts
throw new BrroadcastableQueryStop() // stop this query

```

- User: 사용자가 Render Component 를 통해서 중단할 수 있게 함 (abort, close) -> Timer Stop, Process Stop (signal.aborted), Remove Render 
- Developer: pipe 내에서 특정 조건에 의해서 단순 정상 종료 (throw new Abort()) -> Timer Stop, Remove Render
- Developer: pipe 내에서 특정 조건에 의해서 비정상 종료 (throw any) -> Timer Stop, Remove Render

```ts
const [ query ] = useBroadcastableQuery({
  pipe: [
    fabricateRepay, // Param => Msg[] throws Error
    postWallet, // Msg[] => TxResult throws UserDenied, Error
    waitForBlockCreation, // TxResult => TxInfo throws TxFailed
    parseTxInfo, // TxInfo => Result
  ]
})

query
```