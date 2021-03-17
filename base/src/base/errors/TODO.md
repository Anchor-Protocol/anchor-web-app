# 가능한 Error들

## Transaction

- `timeout(postContractMsg)` -> `<ChromeExtensionWalletProvider> post`
  - \[x] `UserDeniedError`
  - \[x] `OperationTimeoutError` + 대기 시간이 길어서 취소됨
- `parseTxResult`
  - \[x] `TxFailedError` if success is false
- `getTxInfo`
  - \[x] `TxInfoError`
  - \[ ] `*` of ApolloClient
  - \[ ] `OperationTimeoutError` + TxInfo 를 불러올 수 없음 (`getTxInfo` 에 `timeout()` 필요)
- `pick<*>Result`
  - \[x] `TxInfoParseError` + RawLog 를 찾을 수 없음 | Event 를 찾을 수 없음
- `*`
  - \[ ] 그 외, 벗어나는 Error들은 `String(error)` 형태로 처리

## `<Section>`, `<Dialog>`

- `*` 모든 종류의 Error에 대응 (Uncaught가 발생되지 않도록)
  - `<ErrorCapture>...</ErrorCapture>` Container Components 내부에 대응 처리

## `const { error } = use<*>Query()`

- `*` Query 상황에서 발생되는 Error는 App 동작에 영향을 미치지 않도록 처리...
  - `const { error, refetch } = use<*>Query()` 로 잡아서
    - `<QueryErrorMessage error={error} refetch={refetch}>` 로 처리
    - Message 내부에 Refetch Button을 누르면 `refetch()` 일시적인 Network 오류를 피함

## Uncaught Error Handling

- `process.env.NODE_ENV === production` 상황에서만 활성화
  - `Snackbar` 로 처리

## Sentry

- 모든 예상되지 않은 Error들은 `process.env.NODE_ENV === production && Mainnet` 상황에서 Sentry 리포트
