import { Snackbar, useSnackbar } from '@anchor-protocol/snackbar';
import { ApolloError } from '@apollo/client';
import React, { useCallback } from 'react';

export function useQueryErrorHandler(): (error: ApolloError) => void {
  const { addSnackbar } = useSnackbar();

  const callback = useCallback(
    (error: ApolloError) => {
      addSnackbar(
        <Snackbar>
          <pre
            style={{
              border: '2px solid black',
              maxWidth: 500,
              wordBreak: 'break-word',
              whiteSpace: 'break-spaces',
              fontSize: 10,
              padding: 10,
            }}
          >
            {error.message}
          </pre>
        </Snackbar>,
      );
    },
    [addSnackbar],
  );

  return callback;
}
