import { TextInput } from '@libs/neumorphism-ui/components/TextInput';
import { Tooltip } from '@libs/neumorphism-ui/components/Tooltip';
import { CircularProgress, InputAdornment } from '@material-ui/core';
import { Warning, Error } from '@material-ui/icons';
import styled from 'styled-components';
import React from 'react';

export default {
  title: 'components/TextInput',
};

const textAdornmentInputProps = {
  endAdornment: <InputAdornment position="end">UST</InputAdornment>,
};

const warningTooltipAdornmentInputProps = {
  endAdornment: (
    <InputAdornment position="end">
      <Tooltip color="warning" title="Warning message..." placement="top">
        <Warning />
      </Tooltip>
    </InputAdornment>
  ),
};

const errorTooltipAdornmentInputProps = {
  endAdornment: (
    <InputAdornment position="end">
      <Tooltip open color="error" title="Error message..." placement="right">
        <Error />
      </Tooltip>
    </InputAdornment>
  ),
};

const loadingTooltipAdornmentInputProps = {
  endAdornment: (
    <InputAdornment position="end">
      <CircularProgress size="1.5rem" style={{ color: 'currentColor' }} />
    </InputAdornment>
  ),
};

export const Basic = () => {
  return (
    <Layout>
      <TextInput />
      <TextInput disabled />
      <TextInput label="TEXT FIELD" />
      <TextInput label="TEXT FIELD" disabled />
      <TextInput label="ADORNMENT" InputProps={textAdornmentInputProps} />
      <TextInput
        label="ADORNMENT"
        InputProps={textAdornmentInputProps}
        disabled
      />
      <TextInput
        label="WARNING"
        InputProps={warningTooltipAdornmentInputProps}
      />
      <TextInput
        label="WARNING"
        InputProps={warningTooltipAdornmentInputProps}
        disabled
      />
      <TextInput
        label="ERROR"
        error
        InputProps={errorTooltipAdornmentInputProps}
      />
      <TextInput
        label="ERROR"
        error
        InputProps={errorTooltipAdornmentInputProps}
        disabled
      />
      <TextInput
        label="LOADING"
        InputProps={loadingTooltipAdornmentInputProps}
      />
      <TextInput
        label="LOADING"
        InputProps={loadingTooltipAdornmentInputProps}
        disabled
      />
    </Layout>
  );
};

const Layout = styled.div`
  width: 300px;
  display: grid;
  grid-template-columns: repeat(2, 300px);
  grid-gap: 20px;
`;
