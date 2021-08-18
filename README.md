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

# License

This software is licensed under the Apache 2.0 license. Read more about it [here](LICENSE).

© 2021 Anchor Protocol
