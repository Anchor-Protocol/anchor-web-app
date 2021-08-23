import { interpolateBig } from '@libs/big-interpolate';
import big, { Big, BigSource } from 'big.js';
import { easeCircleOut } from 'd3-ease';
import { timer } from 'd3-timer';
import React, {
  DetailedHTMLProps,
  HTMLAttributes,
  useEffect,
  useMemo,
  useRef,
} from 'react';

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
  id?: string;
}

const defaultInitialValue = big(0);

export function AnimateNumber<T extends BigSource>({
  children,
  format,
  initialValue = defaultInitialValue,
  ease = easeCircleOut,
  duration = 400,
  id,
  ...spanProps
}: AnimateNumberProps<T>) {
  const _element = useRef<HTMLSpanElement>(null);
  const _format = useRef<Formatter<T>>(format);
  const _value = useRef<Big>(initialValue);
  const _ease = useRef(ease);
  const _duration = useRef(duration);

  const value = useMemo<T>(() => big(children).toFixed() as T, [children]);

  useEffect(() => {
    _format.current = format;

    if (_element.current) {
      _element.current.textContent = _format.current(_value.current as any);
    }
  }, [format]);

  useEffect(() => {
    _ease.current = ease;
  }, [ease]);

  useEffect(() => {
    _duration.current = duration;
  }, [duration]);

  useEffect(() => {
    if (!_element.current) return;

    const interpolate = interpolateBig({
      from: _value.current,
      to: value,
      ease: _ease.current,
    });

    const ti = timer((elapsed) => {
      const dv = interpolate(Math.min(elapsed / _duration.current, 1));
      _element.current!.textContent = _format.current(dv as T);
      if (elapsed > _duration.current) {
        ti.stop();
        _element.current!.textContent = _format.current(value);
      }
    });

    _value.current = big(value);

    return () => {
      ti.stop();
    };
  }, [value]);

  return (
    <span ref={_element} {...spanProps}>
      {format(value)}
    </span>
  );
}
