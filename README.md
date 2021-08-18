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
- `yarn run app:pack` Build `/app/src/@anchor-protocol` packages (`/app/out` directory will created)
- `yarn run app:publish` Publish `/packages/out` directory to the NPM registry
- `yarn run app:storybook` Development run Storybook
- `yarn run app:build-storybook`
- `yarn run landing:start` Development run `/landing` directory (web browser will open)
- `yarn run landing:build` Build `/landing` directory (`/landing/build` directory will created)
- `yarn run landing:test`
- `yarn run landing:coverage`

# Environments

## Local SSL

The system environment variable `LOCALHOST_HTTPS_CERT` and `LOCALHOST_HTTPS_KEY` are required when you run `yarn run app:start` or `yarn run landing:start` in local.

(WebApp requires https certified by CA to test features such as connectivity and Notification with Walletconnect's wss.)

1. First, you should refer to <https://github.com/FiloSottile/mkcert> to create a root CA on your Local System.
2. Later, create SSL Cert and Key files using commands such as `mkcert localhost 127.0.0.1`.
3. Enter the SSL Cert and Key file addresses in the `LOCALHOST_HTTPS_CERT` and `LOCALHOST_HTTPS_KEY` system environment variables.

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

# Sub packages

<!-- index app/src/**/README.md -->

- [app/src/@anchor-protocol/icons/README.md](app/src/@anchor-protocol/icons/README.md)
- [app/src/@anchor-protocol/notation/README.md](app/src/@anchor-protocol/notation/README.md)
- [app/src/@anchor-protocol/token-icons/README.md](app/src/@anchor-protocol/token-icons/README.md)
- [app/src/@terra-dev/audit-fastdom/README.md](app/src/@terra-dev/audit-fastdom/README.md)
- [app/src/@terra-dev/big-interpolate/README.md](app/src/@terra-dev/big-interpolate/README.md)
- [app/src/@terra-dev/big-math/README.md](app/src/@terra-dev/big-math/README.md)
- [app/src/@terra-dev/is-touch-device/README.md](app/src/@terra-dev/is-touch-device/README.md)
- [app/src/@terra-dev/is-zero/README.md](app/src/@terra-dev/is-zero/README.md)
- [app/src/@terra-dev/neumorphism-ui/README.md](app/src/@terra-dev/neumorphism-ui/README.md)
- [app/src/@terra-dev/sendinblue/README.md](app/src/@terra-dev/sendinblue/README.md)
- [app/src/@terra-dev/snackbar/README.md](app/src/@terra-dev/snackbar/README.md)
- [app/src/@terra-dev/styled-neumorphism/README.md](app/src/@terra-dev/styled-neumorphism/README.md)
- [app/src/@terra-dev/use-dialog/README.md](app/src/@terra-dev/use-dialog/README.md)
- [app/src/@terra-dev/use-element-intersection/README.md](app/src/@terra-dev/use-element-intersection/README.md)
- [app/src/@terra-dev/use-google-analytics/README.md](app/src/@terra-dev/use-google-analytics/README.md)
- [app/src/@terra-dev/use-interval/README.md](app/src/@terra-dev/use-interval/README.md)
- [app/src/@terra-dev/use-local-storage/README.md](app/src/@terra-dev/use-local-storage/README.md)
- [app/src/@terra-dev/use-resolve-last/README.md](app/src/@terra-dev/use-resolve-last/README.md)
- [app/src/@terra-dev/use-restricted-input/README.md](app/src/@terra-dev/use-restricted-input/README.md)
- [app/src/@terra-dev/use-router-scroll-restoration/README.md](app/src/@terra-dev/use-router-scroll-restoration/README.md)
- [app/src/@terra-dev/use-string-bytes-length/README.md](app/src/@terra-dev/use-string-bytes-length/README.md)
- [app/src/@terra-dev/use-time-end/README.md](app/src/@terra-dev/use-time-end/README.md)
- [app/src/polyfills/README.md](app/src/polyfills/README.md)

<!-- /index -->

# License

This software is licensed under the Apache 2.0 license. Read more about it [here](LICENSE).

© 2021 Anchor Protocol
