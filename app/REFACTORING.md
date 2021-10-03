# TODO

- [x] remove `useBrowserInactive()`
- [x] replace `<AnchorWebAppProvider>`
  - [x] `constants` 제거 -> `useApp()` 의존으로 변경 
  - [x] `addressProvider` -> `<AppProvider contractAddress={}>` 를 역으로 `AddressProvider` 로 변경
  - [x] `bAssetsVector` -> `useWallet()` 의존으로 유지 -> 이건 그냥 할 수 있다지만...
  - [x] `indexerApiEndpoint` -> `useWallet()` 의존으로 유지? -> 이건 provider가 필요하다 (config 공급 지점)
- [x] remove `contexts/bank`
- [x] remove `@anchor-protocol/webapp-provider/bank`

- [ ] `@libs/webapp-provider` -> `@libs/app-provider` 변경
- [ ] `@libs/webapp-fns` -> `@libs/app-fns` 변경

## API 

```jsx
<AnchorAppProvider indexerApiEndpoints={}>
</AnchorAppProvider>

const x: App<AnchorContractAddress, AnchorConstants> & { 
    indexerApiEndpoint, 
    addressProvider, 
    bAssetsVector 
} = useAnchorApp()
```