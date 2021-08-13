import type {
  DefinitionNode,
  DocumentNode,
  OperationDefinitionNode,
  SelectionSetNode,
} from 'graphql';

export function findSelectionSet(document: DocumentNode): SelectionSetNode {
  const query: DefinitionNode | undefined = document.definitions.find(
    (definition) =>
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'query',
  );

  if (!query) {
    throw new Error(`Can't find "query" operation from query`);
  }

  return (query as OperationDefinitionNode).selectionSet;
}

export function createDocumentNode(): DocumentNode {
  return {
    kind: 'Document',
    definitions: [
      {
        kind: 'OperationDefinition',
        operation: 'query',
        selectionSet: {
          kind: 'SelectionSet',
          selections: [],
        },
      },
    ],
  };
}
