import React, { Component } from 'react';
import styled from 'styled-components';

export interface ErrorBoundaryProps {}

interface ErrorBoundaryState {
  error: null | Error;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({
      error,
    });

    console.error(errorInfo);
  }

  render() {
    if (this.state.error) {
      return <ErrorView>{this.state.error.toString()}</ErrorView>;
    }

    return this.props.children;
  }
}

const ErrorView = styled.pre`
  width: 100%;
  max-height: 500px;
  overflow-y: auto;
  font-size: 12px;
`;
