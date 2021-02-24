import { Snackbar, useSnackbar } from '@anchor-protocol/snackbar';
import { ApolloError } from '@apollo/client';
import React, { useEffect } from 'react';

export function useQueryErrorAlert(error: ApolloError | undefined) {
  const { addSnackbar } = useSnackbar();

  useEffect(() => {
    if (!error) return;

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
  }, [addSnackbar, error]);
}
