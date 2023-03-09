/* eslint-disable max-len */
import * as React from 'react';
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const GlobalSpin = styled.svg`
  animation: ${rotate} 0.9s linear infinite;
`;

interface Props extends Omit<React.SVGAttributes<SVGElement>, 'color'> {
  size?: number;
  color?: string | string[];
}

const DEFAULT_STYLE: React.CSSProperties = {
  display: 'inline-block',
};

const getIconColor = (color: string | string[] | undefined, index: number, defaultColor: string) => {
  // eslint-disable-next-line no-nested-ternary
  return color ? (typeof color === 'string' ? color : color[index] || defaultColor) : defaultColor;
};

// ===========================================
// ============= Global ======================
// ===========================================
export const IconGlobalSpin: React.FC<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;
  const uuid = React.useId();

  return (
    <GlobalSpin id={uuid} viewBox="0 0 22 22" width={`${size}px`} height={`${size}px`} style={style} {...rest}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11C20 6.02944 15.9706 2 11 2ZM0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11Z"
        fill={getIconColor(color, 1, '#ffffff')}
        fillOpacity="0.5"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 0C17.0745 0 22 4.92549 22 11H20C20 6.03006 15.9699 2 11 2V0Z"
        fill={getIconColor(color, 1, '#ffffff')}
      />
    </GlobalSpin>
  );
};

// ===========================================
// ============= Home ========================
// ===========================================
