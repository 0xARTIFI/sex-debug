import * as React from 'react';
import classNames from 'classnames';
import { cloneElement } from '../_util/reactNode';
import styled from 'styled-components';

const Wrapper = styled.div`
  .label {
    margin-bottom: 8px;
    span {
      font-size: 12px;
      line-height: 18px;
      color: ${(props) => props.theme.textColorPrimary};
      transition: all 0.3s ease-in-out;
    }
    span:first-child {
      font-weight: 500;
    }
  }
  .inform {
    padding: 4px 0;
    min-height: 22px;
    font-size: 12px;
    line-height: 14px;
    color: #ff7878;
    transition: all 0.3s ease-in-out;
  }
  &:not(&.danger) {
    margin-bottom: 22px;
  }
`;

export interface DynamicProps {
  className?: string;
  title: string;
  subtitle?: string;
  inform?: string;
  danger?: boolean;
  children?: React.ReactNode;
}

const Dynamic: React.FC<DynamicProps> = (props: DynamicProps) => {
  const { className, title, subtitle, inform, danger, children } = props;

  const dynamicRef = React.useRef<HTMLDivElement>(null);

  // React.useEffect(() => {
  //   if (!dynamicRef || !dynamicRef.current) {
  //     return;
  //   }
  // }, [dynamicRef]);

  const visible = React.useMemo(() => inform && danger, [inform, danger]);

  const classes = classNames(className, { danger: visible });

  return (
    <Wrapper className={classes} ref={dynamicRef}>
      <p className="label row-between">
        <span>{title}</span>
        {subtitle && <span>{subtitle}</span>}
      </p>
      {cloneElement(children, { danger })}
      {visible && <p className="inform">{inform}</p>}
    </Wrapper>
  );
};

export default Dynamic;
