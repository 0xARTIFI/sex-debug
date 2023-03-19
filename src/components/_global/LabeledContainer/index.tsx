import { ReactNode } from 'react';
import { styled } from 'styled-components';

const Container = styled.div`
  .label {
    font-weight: 600;
    font-size: 16px;
    line-height: 120%;
    color: #54678b;
  }
`;

const LabeledContainer = ({
  label,
  suffix,
  children,
  id,
}: {
  label: ReactNode;
  suffix?: ReactNode;
  children?: ReactNode;
  id?: string;
}) => {
  return (
    <Container className="full-width col-start">
      <div className="full-width row-between">
        <>
          <label className="label" htmlFor={id}>
            {label}
          </label>
          {suffix ? { suffix } : null}
        </>
      </div>
      <div className="full-width" id={id}>
        {children}
      </div>
    </Container>
  );
};

export default LabeledContainer;
