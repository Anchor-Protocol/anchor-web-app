import { ComponentType } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

let ErrorBoundaryComponent: ComponentType = ErrorBoundary;

export function configErrorBoundary(ErrorBoundary: ComponentType) {
  ErrorBoundaryComponent = ErrorBoundary;
}

export function getErrorBoundary(): ComponentType {
  return ErrorBoundaryComponent;
}
