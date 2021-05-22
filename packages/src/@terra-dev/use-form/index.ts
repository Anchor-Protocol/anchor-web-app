import { useCallback, useEffect, useRef, useState } from 'react';

function shallowEqual(a: any, b: any): boolean {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  for (const key of aKeys) {
    if (!Object.is(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

export function useForm<
  Input extends {},
  Dependency extends {},
  States extends {}
>(
  form: (input: Input, dependency: Dependency) => States,
  dependency: Dependency,
  initialInput: () => Input,
): [(input: Partial<Input>) => void, States] {
  const lastInput = useRef(initialInput());
  const lastDependency = useRef<Dependency>(dependency);

  const [states, setStates] = useState<States>(() => {
    return form(lastInput.current, lastDependency.current);
  });

  useEffect(() => {
    if (
      dependency === lastDependency.current ||
      shallowEqual(dependency, lastDependency.current)
    ) {
      return;
    } else {
      setStates(form(lastInput.current, dependency));
      lastDependency.current = dependency;
    }
  }, [dependency, form]);

  const updateInput = useCallback(
    (input: Partial<Input>) => {
      const nextInput = { ...lastInput.current, ...input };

      if (!shallowEqual(nextInput, lastInput.current)) {
        setStates(form(nextInput, lastDependency.current));
        lastInput.current = nextInput;
      }
    },
    [form],
  );

  return [updateInput, states];
}
