import * as React from 'react';
// import useSlider from './hooks/useSlider';
import styled from 'styled-components';

const Wrapper = styled.div``;

export interface KlineProps {
  symbol: string;
}

const Kline: React.FC<KlineProps> = (props: KlineProps) => {
  const { symbol } = props;
  return <Wrapper>{symbol}</Wrapper>;
};

export default Kline;
