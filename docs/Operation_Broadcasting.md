# Operation Broadcasting

1. 화면 내에서 Transaction 요청 
2. 화면 내에서 Chrome Extension의 Transaction 결과 대기
3. 화면 이탈, 대기 상태 해제됨
4. Chrome Extension 에서 Transaction 처리됨
5. 결과를 Web Site 내에서 확인할 수 없음

위와 같은 구조를 해결하기 위해서 별개의 Library를 만들어서 사용한다.

이왕 Library를 만드는 김에 기능 단위를 Pure Function으로 만들고 Pipe Composition 할 수 있는 형태로 제작되었다.

<!-- import ../packages/src/@anchor-protocol/broadcastable-operation/__stories__/broadcast.stories.tsx -->
<!-- /import -->