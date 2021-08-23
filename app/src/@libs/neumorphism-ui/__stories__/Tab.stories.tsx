import { Tab } from '@libs/neumorphism-ui/components/Tab';
import React, { useState } from 'react';

export default {
  title: 'components/Tab',
};

interface Item {
  label: string;
  value: string;
}

const tabItems: Item[] = [
  { label: 'Mint', value: 'tab1' },
  { label: 'Burn', value: 'tab2' },
  { label: 'Claim', value: 'tab3' },
];

export const Basic = () => {
  const [selectedItem, setSelectedItem] = useState<Item>(() => tabItems[0]);

  return (
    <Tab
      items={tabItems}
      selectedItem={selectedItem}
      onChange={(next) => setSelectedItem(next)}
      labelFunction={(item) => item.label}
      keyFunction={(item) => item.value}
    />
  );
};

export const Disabled = () => {
  const [selectedItem, setSelectedItem] = useState<Item>(() => tabItems[0]);

  return (
    <Tab
      disabled
      items={tabItems}
      selectedItem={selectedItem}
      onChange={(next) => setSelectedItem(next)}
      labelFunction={(item) => item.label}
      keyFunction={(item) => item.value}
    />
  );
};
