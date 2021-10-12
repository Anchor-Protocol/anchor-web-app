# TODO

- [x] remove `useBrowserInactive()`
- [x] replace `<AnchorWebAppProvider>`
  - [x] `constants` 제거 -> `useApp()` 의존으로 변경 
  - [x] `addressProvider` -> `<AppProvider contractAddress={}>` 를 역으로 `AddressProvider` 로 변경
  - [x] `bAssetsVector` -> `useWallet()` 의존으로 유지 -> 이건 그냥 할 수 있다지만...
  - [x] `indexerApiEndpoint` -> `useWallet()` 의존으로 유지? -> 이건 provider가 필요하다 (config 공급 지점)
- [x] remove `contexts/bank`
- [x] remove `@anchor-protocol/webapp-provider/bank`
- [x] `@libs/webapp-provider` -> `@libs/app-provider` 변경
- [x] `@libs/webapp-fns` -> `@libs/app-fns` 변경

## Form function

- [ ] airdrop
  - [ ] claim (?)
- [ ] send
- [ ] earn
  - [x] deposit
  - [x] withdraw
- [ ] borrow
  - [ ] provide collateral
  - [ ] redeem collateral
  - [ ] borrow
  - [ ] repay
- [ ] bond
  - [ ] mint
  - [ ] burn
  - [ ] instant burn
  - [ ] bluna claim rewards
  - [ ] withdraw amount
  - [ ] beth claim rewards
- [ ] gov
  - [ ] buy anc
  - [ ] sell anc
  - [ ] stake anc governance
  - [ ] unstake anc governance
  - [ ] provide anc-ust lp
  - [ ] withdraw anc-ust lp
  - [ ] stake anc-ust lp
  - [ ] unstake anc-ust lp
- [ ] poll
  - [ ] create poll (?)
- [ ] rewards
  - [ ] claim all (?)
  - [ ] claim anc-ust lp (?)
  - [ ] claim anc governance (?)


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