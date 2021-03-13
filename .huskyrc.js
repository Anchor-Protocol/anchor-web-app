function precommit(...workspaces) {
  return workspaces.map((workspace) => `yarn workspace ${workspace} run precommit`);
}

module.exports = {
  hooks: {
    'pre-commit': [
      // auto source import every markdown documents
      // @see https://www.npmjs.com/package/@handbook/markdown-source-import
      `markdown-source-import **/src/**/*.md --git-add`,
      // see "lint-staged" on "package.json"
      `lint-staged`,
      // run workspaces precommit hook
      //...precommit(`source`),
    ].join(' && '),
  },
};