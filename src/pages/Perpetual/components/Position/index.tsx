import Input from '@/components/Input';
import { SmartButton } from '@/components/_global';
import { TRADE_DIRECTION_ENUM } from '@/configs/common';
import useClosePositon from '@/hooks/useClosePositon';
import useInputChange from '@/hooks/useInputChange';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { styled } from 'styled-components';

const Container = styled.div`
  margin-top: 12px;
  &.gap,
  .gap {
    gap: 12px;
  }
`;

// {
//   "leverage": "-1.01491666429314303577",
//   "netValue": "-2940.77544",
//   "earnings": "-2954.77544",
//   "earningRates": "-21105.538857142857142857",
//   "collateral": "14.0",
//   "originEntryPrice": "140880",
//   "entryPrice": "1408.8",
//   "size": "212",
//   "sizeValue": "0.0212",
//   "liqPrice": "2028.6052534221235664077",
//   "totalPositionValue": "2984.642",
//   "direction": "SHORT"
// }
const Position = ({ row, futurePrice }: { row: any; futurePrice?: string }) => {
  const { run } = useClosePositon();

  const [closeValue, handleCloseValueChange] = useInputChange({});

  const handleClose = () => {
    run(row?.direction, closeValue, row?.entryPrice);
  };
  const handleAdjust = () => {};

  const prefixUnit = useMemo(() => (row?.direction === TRADE_DIRECTION_ENUM.SHORT ? '$' : '$'), [row]);
  const suffixUnit = useMemo(() => (row?.direction === TRADE_DIRECTION_ENUM.LONG ? '' : ''), [row]);

  return (
    <Container className="col-start full-width gap">
      <div className="row-between">
        <span>Leverage</span>
        <span>{row?.leverage}x</span>
      </div>
      <div className="row-between">
        <span>NetValue</span>
        <span>{row?.netValue}U</span>
      </div>
      <div className="row-between">
        <span>Earning</span>
        <span>
          {row?.earnings}U({row?.earningRates}%)
        </span>
      </div>
      <div className="row-between">
        <span>Size</span>
        <span>
          {prefixUnit}
          {row?.sizeValue}
          {suffixUnit}({row?.size}张)
        </span>
      </div>
      <div className="row-between">
        <span>Collateral</span>
        <span>{row?.collateral}U</span>
      </div>
      <div className="row-between">
        <span>CurrentPrice</span>
        <span>
          {BigNumber(futurePrice || '0')
            .div(100)
            .toString()}
          U
        </span>
      </div>
      <div className="row-between">
        <span>EntryPrice</span>
        <span>{row?.entryPrice}U</span>
      </div>
      <div className="row-between">
        <span>Liq.Price</span>
        <span>{row?.liqPrice}U</span>
      </div>
      {!BigNumber(row?.size).isZero() ? (
        <div className="col-start full-width gap">
          <Input
            value={closeValue}
            onChange={handleCloseValueChange}
            suffix={row?.direction === TRADE_DIRECTION_ENUM.SHORT ? 'U' : 'U'}
          />
          <div className="row-between">
            <SmartButton onClick={handleClose}>Close</SmartButton>
            <SmartButton onClick={handleAdjust}>Collateral</SmartButton>
          </div>
        </div>
      ) : null}
    </Container>
  );
};

export default Position;
