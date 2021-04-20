[![codecov](https://codecov.io/gh/Anchor-Protocol/anchor-web-app/branch/develop/graph/badge.svg?token=FDL5NJ27FS)](https://codecov.io/gh/Anchor-Protocol/anchor-web-app)
[![TEST](https://github.com/Anchor-Protocol/anchor-web-app/actions/workflows/test.yml/badge.svg)](https://github.com/Anchor-Protocol/anchor-web-app/actions/workflows/test.yml)

# Scripts

Initialize this project

```sh
git clone https://github.com/Anchor-Protocol/anchor-web-app.git
cd anchor-web-app
yarn install
```

And you can run scripts

- `yarn run app:start` Development run `/app` directory (web browser will open)
- `yarn run app:build` Build `/app` directory (`/app/build` directory will created)
- `yarn run app:test`
- `yarn run app:coverage`
- `yarn run landing:start` Development run `/landing` directory (web browser will open)
- `yarn run landing:build` Build `/landing` directory (`/app/landing` directory will created)
- `yarn run landing:test`
- `yarn run landing:coverage`
- `yarn run packages:build` Build `/packages/src/@anchor-protocol` packages (`/packages/out` directory will created)
- `yarn run packages:publish` Publish `/packages/out` directory to the NPM registry
- `yarn run packages:storybook` Development run Storybook
- `yarn run packages:build-storybook`
- `yarn run packages:test`

# Environments

## GraphQL

Configurations

- See [.graphqlconfig](.graphqlconfig) file
  - This configuration is the graphql-config v2 spec (IntelliJ only supports that legacy spec)
  - See <https://github.com/kamilkisiela/graphql-config/tree/legacy>
- See [schema.graphql](schema.graphql) file
  - When the schema file is updated. run `yarn run graphql:download-schema`

IDE

- JetBrains <https://plugins.jetbrains.com/plugin/8097-js-graphql>
- VSCode <https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql>

# Domains

## `/app`

| master                           |
| -------------------------------- |
| <https://app.anchorprotocol.com> |
| <https://app.anchor.money>       |
| <https://app.anchor.market>      |

## `/landing`

| master                       |
| ---------------------------- |
| <https://anchorprotocol.com> |
| <https://anchor.money>       |
| <https://anchor.market>      |

## `/packages`

| develop                                     |
| ------------------------------------------- |
| <https://anchor-storybook.vercel.app/>      |
| <https://www.npmjs.com/org/anchor-protocol> |
| <https://www.npmjs.com/org/terra-dev>       |

<!-- index packages/src/**/README.md -->

- [packages/src/@anchor-protocol/icons/README.md](packages/src/@anchor-protocol/icons/README.md)
- [packages/src/@anchor-protocol/notation/README.md](packages/src/@anchor-protocol/notation/README.md)
- [packages/src/@anchor-protocol/token-icons/README.md](packages/src/@anchor-protocol/token-icons/README.md)
- [packages/src/@anchor-protocol/wallet-provider/README.md](packages/src/@anchor-protocol/wallet-provider/README.md)
- [packages/src/@terra-dev/audit-fastdom/README.md](packages/src/@terra-dev/audit-fastdom/README.md)
- [packages/src/@terra-dev/big-interpolate/README.md](packages/src/@terra-dev/big-interpolate/README.md)
- [packages/src/@terra-dev/big-math/README.md](packages/src/@terra-dev/big-math/README.md)
- [packages/src/@terra-dev/broadcastable-operation/README.md](packages/src/@terra-dev/broadcastable-operation/README.md)
- [packages/src/@terra-dev/event-bus/README.md](packages/src/@terra-dev/event-bus/README.md)
- [packages/src/@terra-dev/is-desktop-chrome/README.md](packages/src/@terra-dev/is-desktop-chrome/README.md)
- [packages/src/@terra-dev/is-touch-device/README.md](packages/src/@terra-dev/is-touch-device/README.md)
- [packages/src/@terra-dev/is-zero/README.md](packages/src/@terra-dev/is-zero/README.md)
- [packages/src/@terra-dev/neumorphism-ui/README.md](packages/src/@terra-dev/neumorphism-ui/README.md)
- [packages/src/@terra-dev/sendinblue/README.md](packages/src/@terra-dev/sendinblue/README.md)
- [packages/src/@terra-dev/snackbar/README.md](packages/src/@terra-dev/snackbar/README.md)
- [packages/src/@terra-dev/styled-neumorphism/README.md](packages/src/@terra-dev/styled-neumorphism/README.md)
- [packages/src/@terra-dev/use-dialog/README.md](packages/src/@terra-dev/use-dialog/README.md)
- [packages/src/@terra-dev/use-element-intersection/README.md](packages/src/@terra-dev/use-element-intersection/README.md)
- [packages/src/@terra-dev/use-google-analytics/README.md](packages/src/@terra-dev/use-google-analytics/README.md)
- [packages/src/@terra-dev/use-interval/README.md](packages/src/@terra-dev/use-interval/README.md)
- [packages/src/@terra-dev/use-local-storage/README.md](packages/src/@terra-dev/use-local-storage/README.md)
- [packages/src/@terra-dev/use-resolve-last/README.md](packages/src/@terra-dev/use-resolve-last/README.md)
- [packages/src/@terra-dev/use-restricted-input/README.md](packages/src/@terra-dev/use-restricted-input/README.md)
- [packages/src/@terra-dev/use-router-scroll-restoration/README.md](packages/src/@terra-dev/use-router-scroll-restoration/README.md)
- [packages/src/@terra-dev/use-string-bytes-length/README.md](packages/src/@terra-dev/use-string-bytes-length/README.md)
- [packages/src/@terra-dev/use-time-end/README.md](packages/src/@terra-dev/use-time-end/README.md)
- [packages/src/@terra-dev/walletconnect-qrcode-modal/README.md](packages/src/@terra-dev/walletconnect-qrcode-modal/README.md)
- [packages/src/@terra-dev/walletconnect/README.md](packages/src/@terra-dev/walletconnect/README.md)

<!-- /index -->

# License

This software is licensed under the Apache 2.0 license. Read more about it [here](LICENSE).

© 2021 Anchor Protocol
