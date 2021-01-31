import { Operator } from '../context/types';

export function effect<T extends {}, R, P1 extends {}>(
  o: Operator<T, R>,
  e1: (p: P1) => void,
): Operator<T & P1, R>;

export function effect<T extends {}, R, P1 extends {}, P2 extends {}>(
  o: Operator<T, R>,
  e1: (p: P1) => void,
  e2: (p: P2) => void,
): Operator<T & P1 & P2, R>;

export function effect<
  T extends {},
  R,
  P1 extends {},
  P2 extends {},
  P3 extends {}
>(
  o: Operator<T, R>,
  e1: (p: P1) => void,
  e2: (p: P2) => void,
  e3: (p: P3) => void,
): Operator<T & P1 & P2 & P3, R>;

export function effect<
  T extends {},
  R,
  P1 extends {},
  P2 extends {},
  P3 extends {},
  P4 extends {}
>(
  o: Operator<T, R>,
  e1: (p: P1) => void,
  e2: (p: P2) => void,
  e3: (p: P3) => void,
  e4: (p: P4) => void,
): Operator<T & P1 & P2 & P3 & P4, R>;

export function effect<
  T extends {},
  R,
  P1 extends {},
  P2 extends {},
  P3 extends {},
  P4 extends {},
  P5 extends {}
>(
  o: Operator<T, R>,
  e1: (p: P1) => void,
  e2: (p: P2) => void,
  e3: (p: P3) => void,
  e4: (p: P4) => void,
  e5: (p: P5) => void,
): Operator<T & P1 & P2 & P3 & P4 & P5, R>;

export function effect<
  T extends {},
  R,
  P1 extends {},
  P2 extends {},
  P3 extends {},
  P4 extends {},
  P5 extends {},
  P6 extends {}
>(
  o: Operator<T, R>,
  e1: (p: P1) => void,
  e2: (p: P2) => void,
  e3: (p: P3) => void,
  e4: (p: P4) => void,
  e5: (p: P5) => void,
  e6: (p: P6) => void,
): Operator<T & P1 & P2 & P3 & P4 & P5 & P6, R>;

export function effect<
  T extends {},
  R,
  P1 extends {},
  P2 extends {},
  P3 extends {},
  P4 extends {},
  P5 extends {},
  P6 extends {},
  P7 extends {}
>(
  o: Operator<T, R>,
  e1: (p: P1) => void,
  e2: (p: P2) => void,
  e3: (p: P3) => void,
  e4: (p: P4) => void,
  e5: (p: P5) => void,
  e6: (p: P6) => void,
  e7: (p: P7) => void,
): Operator<T & P1 & P2 & P3 & P4 & P5 & P6 & P7, R>;

export function effect<
  T extends {},
  R,
  P1 extends {},
  P2 extends {},
  P3 extends {},
  P4 extends {},
  P5 extends {},
  P6 extends {},
  P7 extends {},
  P8 extends {}
>(
  o: Operator<T, R>,
  e1: (p: P1) => void,
  e2: (p: P2) => void,
  e3: (p: P3) => void,
  e4: (p: P4) => void,
  e5: (p: P5) => void,
  e6: (p: P6) => void,
  e7: (p: P7) => void,
  e8: (p: P8) => void,
): Operator<T & P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8, R>;

export function effect(
  operator: Operator<any, any>,
  ...effects: ((param: any) => void)[]
): Operator<any, any> {
  return ((param: any) => {
    return Promise.all([operator(param), ...effects.map((e) => e(param))]).then(
      ([value]) => value,
    );
  }) as any;
}
