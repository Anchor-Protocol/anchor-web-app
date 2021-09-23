import { Meta } from '@storybook/react';
import { useForm } from '@libs/use-form';
import React from 'react';

export default {
  title: 'packages/use-form',
} as Meta;

const basicForm =
  (dependency: { c: string }) =>
  (input: {
    a: string;
    b: string;
  }): [
    { a: string; b: string; ab: string },
    Promise<{ abc: string }> | undefined,
  ] => {
    if (
      input.a.trim().length === 0 ||
      input.b.trim().length === 0 ||
      dependency.c.trim().length === 0
    ) {
      return [{ ...input, ab: '0' }, undefined];
    }

    const ab = (parseInt(input.a) + parseInt(input.b)).toString();
    const asyncStates = new Promise<{ abc: string }>((resolve) => {
      setTimeout(() => {
        const abc = (
          parseInt(input.a) +
          parseInt(input.b) +
          parseInt(dependency.c)
        ).toString();
        resolve({ abc });
      }, Math.random() * 3000);
    });

    return [{ ...input, ab }, asyncStates];
  };

export const Basic = () => {
  const [updateInput, states] = useForm(basicForm, { c: '10' }, () => ({
    a: '',
    b: '',
  }));

  return (
    <div>
      <input
        type="text"
        value={states.a}
        placeholder="a"
        onChange={({ target }) => updateInput({ a: target.value, b: states.b })}
      />

      <input
        type="text"
        value={states.b}
        placeholder="b"
        onChange={({ target }) => updateInput({ a: states.a, b: target.value })}
      />

      <ul>
        <li>ab = {states.ab}</li>
        <li>abc = {'abc' in states ? states.abc : '-'}</li>
      </ul>
    </div>
  );
};
