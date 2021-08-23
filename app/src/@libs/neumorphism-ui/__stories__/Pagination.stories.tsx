import { Pagination } from '@libs/neumorphism-ui/components/Pagination';
import React, { useMemo, useState } from 'react';

export default {
  title: 'components/Pagination',
};

export const Basic = () => {
  const totalItems = 100;
  const viewItems = 6;

  const [currentPage, setCurrentPage] = useState<number>(0);

  const { start, end } = useMemo(() => {
    const start = currentPage * viewItems;
    const end = Math.min(start + viewItems, totalItems);

    return {
      start,
      end,
    };
  }, [currentPage]);

  return (
    <div>
      <div style={{ marginBottom: 30 }}>
        [{currentPage}]:{' '}
        {Array.from({ length: end - start }, (_, i) => start + i).join(' / ')}
      </div>

      <Pagination
        totalItems={totalItems}
        pageIndex={currentPage}
        viewItems={viewItems}
        viewPages={7}
        onChange={setCurrentPage}
      />
    </div>
  );
};
