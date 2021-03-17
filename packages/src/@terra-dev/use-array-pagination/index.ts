import { useCallback, useEffect, useRef, useState } from 'react';

export function useArrayPagination<T>(
  data: T[],
  itemsInPage: number,
): {
  page: T[];
  totalPages: number;
  pageIndex: number;
  paging: (index: number) => void;
} {
  const dataRef = useRef<T[]>(data);
  const [page, setPage] = useState<T[]>(() => data.slice(0, itemsInPage));
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(() =>
    Math.ceil(data.length / itemsInPage),
  );

  useEffect(() => {
    dataRef.current = data;
    setPage(data.slice(0, itemsInPage));
    setPageIndex(0);
    setTotalPages(Math.ceil(data.length / itemsInPage));
  }, [data, itemsInPage]);

  const paging = useCallback(
    (index: number) => {
      setPage(
        dataRef.current.slice(
          index * itemsInPage,
          index * itemsInPage + itemsInPage,
        ),
      );
      setPageIndex(index);
    },
    [itemsInPage],
  );

  return {
    page,
    totalPages,
    pageIndex,
    paging,
  };
}
