# Scripts

Initialize this project

```sh
git clone https://github.com/Anchor-Protocol/anchor.git
cd anchor
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
- `yarn run packages:publish` Publish `/packages/out` directory to the NPM registry (<https://www.npmjs.com/org/anchor-protocol>)
- `yarn run packages:storybook` Development run Storybook
- `yarn run packages:build-storybook`
- `yarn run packages:test`

# Environments

## GraphQL

- See [schema.docs.graphql](schema.docs.graphql) file
- See [.graphqlconfig](.graphqlconfig) file
    - This configuration is the graphql-config v2 spec (IntelliJ only supports that legacy spec)
    - See <https://github.com/kamilkisiela/graphql-config/tree/legacy>
- If the GraphQL schema is updated. run `yarn run graphql:schema`
