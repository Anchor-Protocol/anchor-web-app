function precommit(...workspaces) {
  return workspaces.map(
    (workspace) => `yarn workspace ${workspace} run precommit`,
  );
}

module.exports = {
  hooks: {
    'pre-commit': [
      `markdown-source-import README.md "docs/*.md" "app/**/*.md" "packages/**/*.md" --git-add`,
      `lint-staged`,
      //...precommit(`packages-template`),
    ].join(' && '),
  },
};
