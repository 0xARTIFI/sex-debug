/* eslint-disable max-len */
import * as React from 'react';

export const IconSelectArrow: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  return (
    <svg width="14" height="9" viewBox="0 0 14 9" fill="none" {...props}>
      <path
        d="M0.533895 0.894913C0.777394 0.64232 1.15843 0.619357 1.42694 0.826024L1.50386 0.894913L6.99967 6.5962L12.4955 0.894913C12.739 0.64232 13.12 0.619357 13.3885 0.826024L13.4655 0.894913C13.709 1.14751 13.7311 1.54277 13.5319 1.82131L13.4655 1.9011L7.48466 8.10525C7.24116 8.35785 6.86012 8.38081 6.59162 8.17414L6.51469 8.10525L0.533895 1.9011C0.266045 1.62325 0.266045 1.17276 0.533895 0.894913Z"
        fill="#E5E6ED"
      />
    </svg>
  );
};

export const IconGlobalArrowTop: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  return (
    <svg width="6" height="4" viewBox="0 0 6 4" fill="none" {...props}>
      <path d="M6 3.5H0l3-3 3 3z" />
    </svg>
  );
};

export const IconGlobalArrowBottom: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  return (
    <svg width="6" height="4" viewBox="0 0 6 4" fill="none" {...props}>
      <path d="M0 .5h6l-3 3-3-3z" />
    </svg>
  );
};

export const IconGlobalArrowSelect: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  return (
    <svg width="8" height="5" viewBox="0 0 8 5" {...props}>
      <path d="M0.707105 1.70711C0.0771402 1.07714 0.523309 0 1.41421 0H6.58579C7.47669 0 7.92286 1.07714 7.29289 1.70711L4.70711 4.29289C4.31658 4.68342 3.68342 4.68342 3.29289 4.29289L0.707105 1.70711Z" />
    </svg>
  );
};

export const IconGlobalCopy: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" {...props}>
      <path d="M11.459.001a.588.588 0 0 1 .54.54v8.182a.515.515 0 0 1-.54.552H9.275v2.184a.516.516 0 0 1-.552.54H.541a.517.517 0 0 1-.54-.54V3.277c0-.3.24-.545.54-.552h2.183V.54a.516.516 0 0 1 .552-.54h8.183zM8.183 3.816h-7.09v7.09h7.09v-7.09zm2.724-2.723H3.816v1.632h4.907a.588.588 0 0 1 .552.552v4.907h1.632v-7.09z" />
    </svg>
  );
};
