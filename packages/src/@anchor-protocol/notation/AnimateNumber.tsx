import { interpolateBig } from '@terra-dev/big-interpolate';
import big, { Big, BigSource } from 'big.js';
import { easeCircleOut } from 'd3-ease';
import { timer, Timer } from 'd3-timer';
import { DetailedHTMLProps, HTMLAttributes, useEffect, useRef } from 'react';

type Formatter<T extends BigSource> = (value: T) => string;

export interface AnimateNumberProps<T extends BigSource>
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
    'children'
  > {
  children: T;
  initialValue?: Big;
  format: Formatter<T>;
  ease?: (nomalizedTime: number) => number;
  duration?: number;
}

const defaultInitialValue = big(0);

export function AnimateNumber<T extends BigSource>({
  children: value,
  format,
  initialValue = defaultInitialValue,
  ease = easeCircleOut,
  duration = 400,
  ...spanProps
}: AnimateNumberProps<T>) {
  const _element = useRef<HTMLSpanElement>(null);
  const _format = useRef<Formatter<T>>(format);
  const _value = useRef<Big>(initialValue);
  const _timer = useRef<Timer>();

  useEffect(() => {
    _format.current = format;

    if (_element.current) {
      _element.current.textContent = _format.current(_value.current as any);
    }
  }, [format]);

  useEffect(() => {
    if (!_element.current) return;

    _timer.current?.stop();

    if (!_value.current.eq(value)) {
      const interpolate = interpolateBig({
        from: _value.current,
        to: value,
        ease,
      });

      _timer.current = timer((elapsed) => {
        const dv = interpolate(Math.min(elapsed / duration, 1));
        _element.current!.textContent = _format.current(dv as T);
        if (elapsed > duration) {
          _timer.current?.stop();
        }
      });

      _value.current = big(value);
    }
  }, [duration, ease, value]);

  useEffect(
    () => () => {
      _timer.current?.stop();
    },
    [],
  );

  return <span ref={_element} {...spanProps} />;
}
