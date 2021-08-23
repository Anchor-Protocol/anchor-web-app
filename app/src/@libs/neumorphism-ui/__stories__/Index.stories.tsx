import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { HorizontalGraphBar } from '@libs/neumorphism-ui/components/HorizontalGraphBar';
import { HorizontalRuler } from '@libs/neumorphism-ui/components/HorizontalRuler';
import { HorizontalScrollTable } from '@libs/neumorphism-ui/components/HorizontalScrollTable';
import { NativeSelect } from '@libs/neumorphism-ui/components/NativeSelect';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { SelectAndTextInputContainer } from '@libs/neumorphism-ui/components/SelectAndTextInputContainer';
import { Selector } from '@libs/neumorphism-ui/components/Selector';
import { Tab } from '@libs/neumorphism-ui/components/Tab';
import { TextButton } from '@libs/neumorphism-ui/components/TextButton';
import { TextInput } from '@libs/neumorphism-ui/components/TextInput';
import { Tooltip } from '@libs/neumorphism-ui/components/Tooltip';
import { MessageColor, messageColors } from '@libs/neumorphism-ui/themes/Theme';
import { concave, convex, flat, pressed } from '@libs/styled-neumorphism';
import {
  Input,
  InputAdornment,
  Modal,
  NativeSelect as MuiNativeSelect,
} from '@material-ui/core';
import { Warning } from '@material-ui/icons';
import React, { ChangeEvent, Fragment, useState } from 'react';
import styled from 'styled-components';

export default {
  title: 'components/Preview',
};

const screen = {
  mobile: { max: 510 },
  // mobile : @media (max-width: ${screen.mobile.max}px)
  tablet: { min: 511, max: 830 },
  // tablet : @media (min-width: ${screen.tablet.min}px) and (max-width: ${screen.tablet.max}px)
  pc: { min: 831, max: 1439 },
  // pc : @media (min-width: ${screen.pc.min}px)
  monitor: { min: 1440 },
  // monitor : @media (min-width: ${screen.pc.min}px) and (max-width: ${screen.pc.max}px)
  // huge monitor : @media (min-width: ${screen.monitor.min}px)
} as const;

const textFieldInputProps = {
  endAdornment: (
    <InputAdornment position="end">
      <Tooltip color="error" title="Error Tooltip Content" placement="top">
        <Warning />
      </Tooltip>
    </InputAdornment>
  ),
};

interface Item {
  label: string;
  value: string;
}

const selectorItems: Item[] = Array.from(
  { length: Math.floor(Math.random() * 30) },
  (_, i) => ({
    label: 'Item ' + i,
    value: 'item' + i,
  }),
);

const tabItems: Item[] = [
  { label: 'Mint', value: 'tab1' },
  { label: 'Burn', value: 'tab2' },
  { label: 'Claim', value: 'tab3' },
];

export const Preview = () => <Component />;

const Component = styled(({ className }: { className?: string }) => {
  const [dialogOpen, setDialogOpen] = useState<Record<MessageColor, boolean>>(
    () => ({
      normal: false,
      warning: false,
      error: false,
      success: false,
    }),
  );

  const [selectedItem, setSelectedItem] = useState<Record<string, Item | null>>(
    () => ({}),
  );

  return (
    <div className={className}>
      <div className="styles">
        <section className="flat">FLAT</section>
        <section className="concave">CONCAVE</section>
        <section className="convex">CONVEX</section>
        <section className="pressed">PRESSED</section>
      </div>

      <Section className="components">
        <article className="buttons">
          <TextButton>BUTTON</TextButton>
          <ActionButton>BUTTON</ActionButton>
        </article>

        <HorizontalRuler />

        <article className="text-fields">
          <TextInput label="TEXT FIELD" />
          <TextInput
            label="ERROR"
            error={true}
            InputProps={textFieldInputProps}
            helperText="Error Content"
          />
        </article>

        <HorizontalRuler />

        <article className="text-fields">
          <TextInput />
          <TextInput
            error={true}
            InputProps={textFieldInputProps}
            helperText="Error Content"
          />
        </article>

        <HorizontalRuler />

        <article className="buttons">
          {messageColors.map((color) => (
            <Fragment key={color}>
              <ActionButton
                onClick={() =>
                  setDialogOpen((prev) => ({ ...prev, [color]: true }))
                }
              >
                OPEN {color.toUpperCase()} DIALOG
              </ActionButton>

              <Modal
                open={dialogOpen[color]}
                onClose={() =>
                  setDialogOpen((prev) => ({ ...prev, [color]: false }))
                }
              >
                <Dialog
                  color={color}
                  style={{ width: 600, height: 400 }}
                  onClose={() =>
                    setDialogOpen((prev) => ({ ...prev, [color]: false }))
                  }
                >
                  <h1 style={{ textAlign: 'center', fontWeight: 300 }}>
                    Title
                  </h1>
                </Dialog>
              </Modal>
            </Fragment>
          ))}
        </article>

        <HorizontalRuler />

        <article className="buttons">
          {messageColors.map((color) => (
            <Tooltip key={color} title={color} color={color} placement="top">
              <TextButton>{color.toUpperCase()} TOOLTIP</TextButton>
            </Tooltip>
          ))}
        </article>

        <HorizontalRuler />

        <article className="buttons">
          <NativeSelect
            value={
              selectedItem['nativeSelect']?.value ?? selectorItems[0].value
            }
            onChange={(evt: ChangeEvent<HTMLSelectElement>) =>
              setSelectedItem((prev) => ({
                ...prev,
                nativeSelect:
                  selectorItems.find(
                    ({ value }) => evt.target.value === value,
                  ) ?? null,
              }))
            }
          >
            {selectorItems.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </NativeSelect>

          <SelectAndTextInputContainer gridColumns={[100, '1fr']}>
            <MuiNativeSelect
              value={
                selectedItem['selectAndTextInput']?.value ??
                selectorItems[0].value
              }
              onChange={(evt) =>
                setSelectedItem((prev) => ({
                  ...prev,
                  selectAndTextInput:
                    selectorItems.find(
                      ({ value }) => evt.target.value === value,
                    ) ?? null,
                }))
              }
            >
              {selectorItems.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </MuiNativeSelect>
            <Input placeholder="PLACEHOLDER" />
          </SelectAndTextInputContainer>

          <Selector
            items={selectorItems}
            selectedItem={selectedItem['selector']}
            onChange={(next) =>
              setSelectedItem((prev) => ({ ...prev, selector: next }))
            }
            labelFunction={(item) => item?.label ?? 'None'}
            keyFunction={(item) => item.value}
          />
        </article>

        <HorizontalRuler />

        <article>
          <Tab
            items={tabItems}
            selectedItem={selectedItem['tab'] ?? tabItems[0]}
            onChange={(next) =>
              setSelectedItem((prev) => ({ ...prev, tab: next }))
            }
            labelFunction={(item) => item.label}
            keyFunction={(item) => item.value}
          />
        </article>

        <HorizontalRuler />

        <article>
          <HorizontalGraphBar<{ value: number; color: string }>
            style={{ margin: '50px 0' }}
            min={-100}
            max={100}
            data={[
              { value: 50, color: '#4da3ee' },
              { value: 0, color: '#ffffff' },
              { value: -50, color: '#ff8a4b' },
            ]}
            colorFunction={({ color }) => color}
            valueFunction={({ value }) => value}
            labelRenderer={({ value }, rect) => {
              return (
                <span
                  style={{
                    top: -25,
                    left: rect.x + rect.width,
                    transform: 'translateX(-50%)',
                  }}
                >
                  {value}
                </span>
              );
            }}
          >
            <span style={{ top: 25, left: 0 }}>Borrow Limit</span>
            <span style={{ top: 25, right: 0 }}>$246k</span>
          </HorizontalGraphBar>
        </article>
      </Section>

      <Section className="table">
        <HorizontalScrollTable minWidth={800}>
          <colgroup>
            <col style={{ width: 300 }} />
            <col style={{ width: 300 }} />
            <col style={{ width: 300 }} />
            <col style={{ width: 300 }} />
          </colgroup>
          <thead>
            <tr>
              <th>A</th>
              <th>B</th>
              <th style={{ textAlign: 'right' }}>C</th>
              <th style={{ textAlign: 'right' }}>D</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }, (_, i) => (
              <tr key={`row-${i}`}>
                <td>{'A'.repeat(i * 3 + 1)}</td>
                <td>{'B'.repeat(i * 3 + 1)}</td>
                <td style={{ textAlign: 'right' }}>
                  {'C'.repeat(i * 3 + 1)}
                  <br />
                  {'C'.repeat(i * 2 + 1)}
                </td>
                <td style={{ textAlign: 'right' }}>{'D'.repeat(i * 3 + 1)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>A</td>
              <td>B</td>
              <td style={{ textAlign: 'right' }}>C</td>
              <td style={{ textAlign: 'right' }}>D</td>
            </tr>
          </tfoot>
        </HorizontalScrollTable>
      </Section>
    </div>
  );
})`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};

  .styles {
    section {
      border-radius: 20px;
      padding: 20px;

      text-align: center;
      color: ${({ theme }) => theme.textColor};

      &.flat {
        ${({ theme }) =>
          flat({
            color: theme.backgroundColor,
            distance: 6,
            intensity: theme.intensity,
          })};
      }

      &.concave {
        ${({ theme }) =>
          concave({
            color: theme.backgroundColor,
            distance: 6,
            intensity: theme.intensity,
          })};
      }

      &.convex {
        ${({ theme }) =>
          convex({
            color: theme.backgroundColor,
            distance: 6,
            intensity: theme.intensity,
          })};
      }

      &.pressed {
        ${({ theme }) =>
          pressed({
            color: theme.backgroundColor,
            distance: 6,
            intensity: theme.intensity,
          })};
      }
    }
  }

  margin-bottom: 1px;

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  .styles {
    display: flex;
    margin-bottom: 30px;
  }

  .components {
    hr {
      margin: 30px 0;
    }

    margin-bottom: 30px;
  }

  .table {
    margin-bottom: 30px;
  }

  // pc
  @media (min-width: ${screen.pc.min}px) {
    padding: 100px;

    .styles {
      section {
        flex: 1;

        &:not(:last-child) {
          margin-right: 30px;
        }
      }
    }

    .components {
      .buttons,
      .text-fields {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 15px;
      }
    }
  }

  // tablet
  @media (min-width: ${screen.tablet.min}px) and (max-width: ${screen.tablet
      .max}px) {
    padding: 30px;

    .styles {
      section {
        flex: 1;

        &:not(:last-child) {
          margin-right: 10px;
        }
      }
    }

    .components {
      .buttons,
      .text-fields {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 15px;
      }
    }

    .NeuSection-content {
      padding: 30px;
    }
  }

  // mobile
  @media (max-width: ${screen.mobile.max}px) {
    padding: 30px 20px;

    .styles {
      flex-direction: column;

      section {
        &:not(:last-child) {
          margin-bottom: 20px;
        }
      }
    }

    .components {
      .buttons,
      .text-fields {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        grid-gap: 15px;
      }

      .text-fields {
        grid-gap: 40px;
      }
    }

    .NeuSection-content {
      padding: 20px;
    }
  }
`;
