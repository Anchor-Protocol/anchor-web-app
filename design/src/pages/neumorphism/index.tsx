import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { HorizontalScrollTable } from '@anchor-protocol/neumorphism-ui/components/HorizontalScrollTable';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { SelectAndTextInputContainer } from '@anchor-protocol/neumorphism-ui/components/SelectAndTextInputContainer';
import { TextButton } from '@anchor-protocol/neumorphism-ui/components/TextButton';
import { TextInput } from '@anchor-protocol/neumorphism-ui/components/TextInput';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import {
  MessageColor,
  messageColors,
} from '@anchor-protocol/neumorphism-ui/themes/Theme';
import { Selector } from '@anchor-protocol/neumorphism-ui/components/Selector';
import {
  concave,
  convex,
  flat,
  pressed,
} from '@anchor-protocol/styled-neumorphism';
import { Input, InputAdornment, Modal, NativeSelect } from '@material-ui/core';
import { Warning } from '@material-ui/icons';
import { mediaQuery } from 'components/layout/mediaQuery';
import { useState, Fragment } from 'react';
import styled from 'styled-components';

export interface NeumorphismProps {
  className?: string;
}

const textFieldInputProps = {
  endAdornment: (
    <InputAdornment position="end">
      <Tooltip color="error" title="Error Tooltip Content" placement="top">
        <Warning />
      </Tooltip>
    </InputAdornment>
  ),
};

interface SelectorItem {
  label: string;
  value: string;
}

const selectorItems: SelectorItem[] = Array.from(
  { length: Math.floor(Math.random() * 30) },
  (_, i) => ({
    label: 'Item ' + i,
    value: 'item' + i,
  }),
);

function NeumorphismBase({ className }: NeumorphismProps) {
  const [dialogOpen, setDialogOpen] = useState<Record<MessageColor, boolean>>(
    () => ({
      normal: false,
      warning: false,
      error: false,
      success: false,
    }),
  );

  const [selectedItem, setSelectedItem] = useState<
    Record<string, SelectorItem | null>
  >(() => ({}));

  return (
    <div className={className}>
      <div className="styles">
        <section className="flat">FLAT</section>
        <section className="concave">CONCAVE</section>
        <section className="convex">CONVEX</section>
        <section className="pressed">PRESSED</section>
      </div>

      <Section className="components">
        <div className="buttons">
          <TextButton>BUTTON</TextButton>
          <ActionButton>BUTTON</ActionButton>
        </div>

        <HorizontalRuler style={{ marginBottom: 50 }} />

        <div className="text-fields">
          <TextInput label="TEXT FIELD" />
          <TextInput
            label="ERROR"
            error={true}
            InputProps={textFieldInputProps}
            helperText="Error Content"
          />
        </div>

        <HorizontalRuler style={{ marginBottom: 50 }} />

        <div className="text-fields">
          <TextInput />
          <TextInput
            error={true}
            InputProps={textFieldInputProps}
            helperText="Error Content"
          />
        </div>

        <HorizontalRuler />

        <div className="buttons">
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
        </div>

        <HorizontalRuler />

        <div className="buttons">
          {messageColors.map((color) => (
            <Tooltip key={color} title={color} color={color} placement="top">
              <TextButton>{color.toUpperCase()} TOOLTIP</TextButton>
            </Tooltip>
          ))}
        </div>

        <HorizontalRuler />

        <div className="buttons">
          <Selector
            items={selectorItems}
            selectedItem={selectedItem['selector']}
            onChange={(next) =>
              setSelectedItem((prev) => ({ ...prev, selector: next }))
            }
            labelFunction={(item) => item?.label ?? 'None'}
            keyFunction={(item) => item.value}
          />

          <SelectAndTextInputContainer>
            <NativeSelect
              value={
                selectedItem['nativeSelect']?.value ?? selectorItems[0].value
              }
              onChange={(evt) =>
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
            <Input placeholder="PLACEHOLDER" />
          </SelectAndTextInputContainer>
        </div>
      </Section>

      <Section className="table">
        <HorizontalScrollTable>
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
}

export const Neumorphism = styled(NeumorphismBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  background-color: ${({ theme }) => theme.backgroundColor};

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
  @media (${mediaQuery.pc}) {
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

    .components,
    .table {
      padding: 50px;
    }
  }

  // tablet
  @media (${mediaQuery.tablet}) {
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

    .components,
    .table {
      padding: 30px;
    }
  }

  // mobile
  @media (${mediaQuery.mobile}) {
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

    .components,
    .table {
      padding: 20px;
    }
  }
`;
