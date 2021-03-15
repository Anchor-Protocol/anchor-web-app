import * as path from 'path';
import * as ts from 'typescript';
import { src } from './env';

(async () => {
  const rootDir = path.resolve(src, '..');

  const compilerOptions: ts.CompilerOptions = {
    rootDir,
  };

  const host: ts.CompilerHost = ts.createCompilerHost(compilerOptions);

  const files: string[] = host.readDirectory!(
    rootDir,
    ['.ts'],
    [
      'src/@anchor-protocol/types/contracts/index.ts',
      'src/@anchor-protocol/types/contracts/common.ts',
    ],
    ['src/@anchor-protocol/types/contracts/*.ts'],
  );

  const program: ts.Program = ts.createProgram(files, compilerOptions, host);

  function search(node: ts.Node) {}

  for (const file of files) {
    const sourceFile: ts.SourceFile | undefined = program.getSourceFile(file);

    if (!sourceFile) continue;

    search(sourceFile);
  }
})();
