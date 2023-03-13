import * as React from 'react';
import { cloneElement } from '../_util/reactNode';
import { MacScrollbar, MacScrollbarProps } from 'mac-scrollbar';
import 'mac-scrollbar/dist/mac-scrollbar.css';
import styled from 'styled-components';

export type ScrollbarProps = MacScrollbarProps;

const Wrapper = styled(MacScrollbar)<ScrollbarProps>`
  width: inherit;
  height: inherit;
`;

const Scrollbar: React.FC<ScrollbarProps> = (props: ScrollbarProps) => {
  const { children, ...rest } = props;

  return (
    <Wrapper
      skin="dark"
      trackStyle={(horizontal) => ({ [horizontal ? 'height' : 'width']: 0, right: 0, border: 0 })}
      thumbStyle={(horizontal) => ({ [horizontal ? 'height' : 'width']: 3 })}
      trackGap={[4, 4, 4, 4]}
      {...rest}
    >
      {cloneElement(children)}
    </Wrapper>
  );
};

export default Scrollbar;
