import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

function shallowEqual(a: any, b: any): boolean {
  if (a === b) {
    return true;
  }

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

export type FormInput<Input> = (
  input: Partial<Input> | ((prev: Input) => Input),
) => void;

export type FormStates<States, AsyncStates> = States & (AsyncStates | {});

export type FormReturn<States, AsyncStates> = [
  States,
  Promise<AsyncStates & Partial<States>> | undefined,
];

export type FormFunction<
  Input extends {},
  Dependency extends {},
  States extends {},
  AsyncStates extends {},
> = (
  dependency: Dependency,
  prevDependency: Dependency | undefined,
) => (
  input: Input,
  prevInput: Input | undefined,
) => FormReturn<States, AsyncStates>;

export function useForm<
  Input extends {},
  Dependency extends {},
  States extends {},
  AsyncStates extends {},
>(
  form: FormFunction<Input, Dependency, States, AsyncStates>,
  dependency: Dependency,
  initialInput: () => Input,
): [FormInput<Input>, FormStates<States, AsyncStates>] {
  const initialForm = useRef(form);

  const [initialInputValue] = useState(() => {
    return initialInput();
  });

  const lastInput = useRef(initialInputValue);
  const lastDependency = useRef<Dependency>(dependency);

  const [initialDepResolved] = useState(() => {
    return initialForm.current(lastDependency.current, undefined);
  });

  const depResolved = useRef(initialDepResolved);

  const resolver = useMemo<Resolver<AsyncStates & Partial<States>>>(() => {
    return new Resolver<AsyncStates & Partial<States>>();
  }, []);

  const [initialStates, initialAsyncStates] = useMemo<
    [States, Promise<AsyncStates & Partial<States>> | undefined]
  >(() => {
    return depResolved.current(lastInput.current, undefined);
  }, []);

  const [states, setStates] = useState<States>(() => initialStates);

  const [asyncStates, setAsyncStates] = useState<
    (AsyncStates & Partial<States>) | undefined
  >(undefined);

  useEffect(() => {
    if (form !== initialForm.current) {
      console.warn(`Do not change form() reference!`);
    }
  }, [form]);

  useEffect(() => {
    if (initialAsyncStates) {
      resolver.next(initialAsyncStates);
    }
  }, [initialAsyncStates, resolver]);

  useEffect(() => {
    if (
      dependency === lastDependency.current ||
      shallowEqual(dependency, lastDependency.current)
    ) {
      return;
    } else {
      depResolved.current = initialForm.current(
        dependency,
        lastDependency.current,
      );

      const [nextStates, nextAsyncStates] = depResolved.current(
        lastInput.current,
        lastInput.current,
      );

      setStates(nextStates);

      if (nextAsyncStates) {
        resolver.next(nextAsyncStates);
      } else {
        resolver.clear();
        setAsyncStates(undefined);
      }

      lastDependency.current = dependency;
    }
  }, [dependency, resolver]);

  const updateInput = useCallback(
    (input: Partial<Input> | ((prev: Input) => Input)) => {
      const nextInput =
        typeof input === 'function'
          ? input(lastInput.current)
          : { ...lastInput.current, ...input };

      if (!shallowEqual(nextInput, lastInput.current)) {
        const [nextStates, nextAsyncStates] = depResolved.current(
          nextInput,
          lastInput.current,
        );

        setStates(nextStates);

        if (nextAsyncStates) {
          resolver.next(nextAsyncStates);
        } else {
          resolver.clear();
          setAsyncStates(undefined);
        }

        lastInput.current = nextInput;
      }
    },
    [resolver],
  );

  useEffect(() => {
    resolver.subscribe(setAsyncStates);

    return () => {
      resolver.destroy();
    };
  }, [resolver]);

  return [updateInput, { ...states, ...asyncStates }];
}

export class Resolver<T> {
  latestId: number = -1;
  subscriptions: Set<(value: T) => void> = new Set();

  subscribe = (subscription: (value: T) => void): (() => void) => {
    this.subscriptions.add(subscription);

    return () => {
      this.subscriptions.delete(subscription);
    };
  };

  next = (value: Promise<T> | T) => {
    const id = Math.random() * 1000000;
    this.latestId = id;

    Promise.resolve(value).then((resolvedValue) => {
      if (this.latestId === id) {
        for (const subscription of this.subscriptions) {
          subscription(resolvedValue);
        }
      }
    });
  };

  clear = () => {
    this.latestId = -1;
  };

  destroy = () => {
    this.subscriptions.clear();
  };
}
