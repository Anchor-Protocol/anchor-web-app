import { InputEntry } from "../validate-input"

export const validateIsNumber = (n: number | string): InputEntry => (
  [
    () => !Number.isNaN(n),
    `invalid number ${n}`,
  ]
)

export const validateIsGreaterThanZero = (n: number | string): InputEntry => (
  [
    () => n > 0,
    `number should be > 0.`
  ]
)

export const validateIsStringPrecision = (n: string): InputEntry => (
  [
    () => !Number.isNaN(n) && n.toString().split('.').length === 2,
    `number should be in precision format: ${n}.`
  ]
)