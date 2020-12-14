# Scripts

Initialize this project

```sh
git clone https://github.com/Anchor-Protocol/anchor.git
cd anchor
yarn install
cd app # go to app directory
```

Scripts in `/app` directory

- `yarn run start` Start development
- `yarn run build` Build production files
- `yarn run pack` Build packages
- `yarn run publish` Publish built packages to NPM
- `yarn run storybook` Start storybook development

# Directory Structure

- `/app` App directory
  - `/src` Source directory
    - `/@anchor-protocol/*` Packages (see the `yarn run pack` command and `.package.yaml` file)
