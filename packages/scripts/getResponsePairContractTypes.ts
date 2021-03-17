import path from 'path';
import ts from 'typescript';
import { src } from './env';

export async function getResponsePairContractTypes(targetFiles: string[]): Promise<string[]> {
  const rootDir = path.resolve(src, '..');

  const compilerOptions: ts.CompilerOptions = {
    rootDir,
  };

  const host: ts.CompilerHost = ts.createCompilerHost(compilerOptions);

  const files: string[] = host.readDirectory!(
    rootDir,
    ['.ts'],
    [],
    targetFiles.map((file) => `src/@anchor-protocol/types/contracts/${file}.ts`),
  );

  const program: ts.Program = ts.createProgram(files, compilerOptions, host);

  const interfaces = new Set<string>();

  const traverse = (namespaces: string[]) => (node: ts.Node) => {
    if (ts.isInterfaceDeclaration(node) && ts.isIdentifier(node.name)) {
      interfaces.add([...namespaces, node.name.escapedText].join('.'));
    } else if (
      ts.isModuleDeclaration(node) &&
      node.body &&
      ts.isIdentifier(node.name)
    ) {
      ts.forEachChild(
        node.body,
        traverse([...namespaces, node.name.escapedText.toString()]),
      );
    } else if (ts.isSourceFile(node)) {
      ts.forEachChild(node, traverse(namespaces));
    }
  };

  for (const file of files) {
    const sourceFile: ts.SourceFile | undefined = program.getSourceFile(file);
    if (!sourceFile) continue;
    traverse([])(sourceFile);
  }

  const responsePairInterfaces: string[] = [];

  for (const i of interfaces) {
    if (/Response$/.test(i) && interfaces.has(i.substring(0, i.length - 8))) {
      responsePairInterfaces.push(i.substring(0, i.length - 8));
    }
  }

  return responsePairInterfaces;
}
