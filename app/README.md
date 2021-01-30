# Directory Structure

- graphql query and clients (hooks, fetch functions)
- ~~operations~~ -> 그냥 component 내에서 처리 (맥락을 굳이 분리할 필요가 없을듯...)
- transactions -> transaction 에 관련된 모든 것들을 일괄 처리? operator들의 모음
- components -> 시각적 / 동작적 component 들 모음 (일단 구분없이 일괄 처리)
- popup 으로 이루어지는 거래 화면들은 그냥 page/ 아래로 이동 (최상위 의미를 가지도록...)
- operations 역시 그냥 최상위로 이동... (최상위 의미를 지닌다)

- `queries/*` graphql query
- `transactions/*` transaction operators
- `components/*` rendering components
