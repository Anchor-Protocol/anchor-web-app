const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

const { src } = require('../env');

const contracts = `${src}/@anchor-protocol/types/contracts`;

async function createIndex(dir) {
  const importPaths = glob
    .sync(`${dir}/*`)
    .filter((file) => !/index.ts$/.test(file))
    .map((file) => {
      const name = path.basename(file, '.ts');

      if (/.ts$/.test(file)) {
        return `export * from './${name}';`;
      } else {
        return `export * as ${name} from './${name}';`;
      }
    });

  const indexSource = `// AUTO GENERATED FILE\n${importPaths.join('\n')}`;

  await fs.writeFile(path.resolve(dir, 'index.ts'), indexSource, {
    encoding: 'utf8',
  });
}

const run = async () => {
  const contractDirs = glob
    .sync(`${contracts}/**`)
    .filter((file) => !/.ts$/.test(file));

  for (const dir of contractDirs) {
    await createIndex(dir);
  }

  await createIndex(contracts);
};

run();
