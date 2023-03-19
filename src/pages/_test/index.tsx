import * as React from 'react';
import { message } from '@/components';
import styled from 'styled-components';

const Wrapper = styled.div`
  div {
    margin: 100px auto;
    width: 200px;
    color: #ffffff;
  }
`;

export function Component() {
  return (
    <Wrapper>
      <div
        onClick={() => {
          message.success('hello');
        }}
      >
        Click
      </div>
    </Wrapper>
  );
}

Component.displayName = 'Test';
