import React, { DetailedHTMLProps, HTMLAttributes, useMemo } from 'react';
import styled from 'styled-components';
import { FirstPage, LastPage } from '@material-ui/icons';

export interface PaginationProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
    'onChange'
  > {
  totalItems: number;
  pageIndex: number;
  viewItems: number;
  viewPages: number;
  onChange: (nextPageIndex: number) => void;
}

function PaginationBase({
  totalItems,
  pageIndex,
  viewItems,
  viewPages,
  onChange,
  ...ulProps
}: PaginationProps) {
  const { totalPages, startPage, endPage } = useMemo(() => {
    const totalPages = Math.ceil(totalItems / viewItems);

    let startPage = Math.max(0, Math.ceil(pageIndex - viewPages / 2));
    let endPage = Math.min(totalPages, startPage + viewPages);

    if (endPage === totalPages) {
      startPage = Math.max(0, endPage - viewPages);
    }

    return {
      totalPages,
      startPage,
      endPage,
    };
  }, [pageIndex, totalItems, viewItems, viewPages]);

  if (totalItems < viewItems) {
    return null;
  }

  return (
    <ul {...ulProps}>
      {startPage > 1 && (
        <li onClick={() => onChange(0)}>
          <FirstPage />
        </li>
      )}
      {Array.from({ length: endPage - startPage }, (_, i) => {
        const pageNumber = startPage + i;
        return (
          <li
            key={pageNumber}
            data-selected={pageNumber === pageIndex}
            onClick={() => onChange(pageNumber)}
          >
            {pageNumber + 1}
          </li>
        );
      })}
      {endPage < totalPages && (
        <li onClick={() => onChange(totalPages - 1)}>
          <LastPage />
        </li>
      )}
    </ul>
  );
}

export const Pagination = styled(PaginationBase)`
  list-style: none;
  padding: 0;

  display: flex;
  gap: 5px;

  li {
    cursor: pointer;
    user-select: none;

    width: 30px;
    height: 30px;

    display: grid;
    place-content: center;

    border-radius: 50%;

    &[data-selected='true'] {
      color: ${({ theme }) => theme.actionButton.textColor};
      background-color: ${({ theme }) => theme.actionButton.backgroundColor};
    }
  }
`;
