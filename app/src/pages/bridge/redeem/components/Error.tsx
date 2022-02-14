import React from 'react';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { UIElementProps } from 'components/layouts/UIElementProps';
import { Close } from '@material-ui/icons';

interface ErrorProps extends UIElementProps {
  sequence: string;
}

const Error = (props: ErrorProps) => {
  const { className, sequence } = props;
  return (
    <CenteredLayout className={className} maxWidth={800}>
      <Section className="error">
        <div className="icon">
          <Close />
        </div>
        <h2>Oops, something went wrong!</h2>
        <p className="text">
          {`The sequence number ${sequence} could not be found.`}
        </p>
      </Section>
    </CenteredLayout>
  );
};

export { Error };
