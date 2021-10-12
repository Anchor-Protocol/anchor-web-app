import fs from 'fs/promises';
import glob from 'glob';
import path from 'path';

const template = (
  rootExports: string,
  exports: string,
) => `// THIS FILE IS AUTO CREATED
// @see ~/scripts/create-index.ts
${rootExports}
${exports}
`;

function createIndex(packageRoot: string, addedExports: string[]) {
  const files = glob.sync(`*/**/*.{ts,tsx}`, {
    cwd: packageRoot,
    ignore: [`**/__*__/**`, `**/internal/**`],
  });

  const index = template(
    addedExports.map((exp) => `export * from '${exp}';`).join('\n'),
    files
      .map((file) => `export * from './${file.replace(/\.tsx?$/, '')}';`)
      .join('\n'),
  );

  fs.writeFile(path.resolve(packageRoot, 'index.ts'), index, {
    encoding: 'utf8',
  }).then(() => {
    console.log(`👍 ${path.resolve(packageRoot, 'index.ts')}`);
  });
}

createIndex(path.resolve(__dirname, '../src/@libs/app-fns'), ['./errors']);
createIndex(path.resolve(__dirname, '../src/@libs/app-provider'), [
  './env',
  './types',
]);
createIndex(path.resolve(__dirname, '../src/@anchor-protocol/app-fns'), [
  './env',
  './types',
]);
createIndex(path.resolve(__dirname, '../src/@anchor-protocol/app-provider'), [
  './env',
  './types',
]);
