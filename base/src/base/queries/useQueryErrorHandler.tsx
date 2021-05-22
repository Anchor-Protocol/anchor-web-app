import { Snackbar, useSnackbar } from '@terra-dev/snackbar';
import { ApolloError } from '@apollo/client';
import { onProduction } from '../env';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { captureException } from '@sentry/react';

// TODO remove after refactoring done
export function useQueryErrorHandler(): (error: ApolloError) => void {
  const { addSnackbar } = useSnackbar();

  const callback = useCallback(
    (error: ApolloError) => {
      captureException(error);

      if (!onProduction) {
        addSnackbar(
          <Snackbar>
            <Message>{error.message}</Message>
          </Snackbar>,
        );
      }
    },
    [addSnackbar],
  );

  return callback;
}

const Message = styled.pre`
  max-width: 600px;
  word-break: break-word;
  white-space: break-spaces;
  font-size: 12px;
  color: white;
  background-color: ${({ theme }) => theme.colors.negative};
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 0 21px 4px rgba(0, 0, 0, 0.3);
`;
