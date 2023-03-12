import Input from '@/components/Input';
import Tabs from '@/components/Tabs';
import { SmartButton } from '@/components/_global';
import { TRADE_DIRECTION_ENUM } from '@/configs/common';
import useExchangeFuturePrice from '@/hooks/perpetual/useExchangeFuturePrice';
import useFetchPerpetualPositions from '@/hooks/perpetual/useFetchPerpetualPositions';
import useOpenPosition from '@/hooks/perpetual/useOpenPosition';
import useAuth from '@/hooks/useAuth';
import useInputChange from '@/hooks/useInputChange';
import { recoilExchangeFuturePrice, recoilPerpetualPositions } from '@/models/_global';
import { useInterval } from 'ahooks';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { styled } from 'styled-components';
import Position from './components/Position';

const Container = styled.div`
  .bp {
    border: 1px solid rgba(0, 0, 0, 0.4);
    padding: 10px;
  }
  &.gap,
  .gap {
    gap: 20px;
  }
  .row-between,
  .col-center {
    gap: 12px;
    width: 100%;
  }
  .tab {
    margin-bottom: 18px;
  }
  .divider {
    height: 1px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    margin: 20px 0;
  }
`;

const perpetualTab = [
  { name: TRADE_DIRECTION_ENUM.LONG, key: TRADE_DIRECTION_ENUM.LONG },
  { name: TRADE_DIRECTION_ENUM.SHORT, key: TRADE_DIRECTION_ENUM.SHORT },
];

const Perpetual = () => {
  const { isConnected } = useAuth();
  const { futurePrice } = useRecoilValue(recoilExchangeFuturePrice);
  const [curDirection, handleChangeTab] = useInputChange({ defaultValue: TRADE_DIRECTION_ENUM.LONG });
  const [payAmount, handleAmountChange] = useInputChange({});
  const [leverage, handleLeverageChange] = useInputChange({ defaultValue: 1 });
  const [interval, setInterval] = useState<undefined | number>(undefined);

  const { run: fetchFuturePrice } = useExchangeFuturePrice();
  const { run: fetchPositon } = useFetchPerpetualPositions();

  useInterval(() => {
    console.count();
    fetchPositon();
    fetchFuturePrice();
  }, interval);

  const { run } = useOpenPosition();
  const handleConfirm = () => {
    run(curDirection, payAmount, leverage);
  };

  useEffect(() => {
    if (isConnected) {
      fetchPositon();
      setInterval(10000);
    } else {
      setInterval(undefined);
    }
  }, [isConnected]);

  const { LONG, SHORT } = useRecoilValue(recoilPerpetualPositions);

  return (
    <Container className="full-width row-between gap">
      <div className="full-width bp">
        <Tabs items={perpetualTab} onChange={handleChangeTab} />

        <div className="col-center">
          <div className="row-between">
            <span>Pay</span>
            <Input
              suffix={curDirection === TRADE_DIRECTION_ENUM.SHORT ? 'U' : 'E'}
              value={payAmount}
              onChange={handleAmountChange}
            />
          </div>

          <div className="row-between">
            <span>Leverage</span>
            <Input value={leverage} onChange={handleLeverageChange} />
          </div>

          <div className="row-between">
            <span>Total Cost</span>
            <span>
              {BigNumber(leverage)
                .multipliedBy(payAmount || 0)
                .toString()}
            </span>
          </div>

          <SmartButton onClick={handleConfirm}>CONFIRM</SmartButton>
        </div>
      </div>
      <div className="full-width bp col-start">
        <div className="col-start full-width">
          <span>LONG</span>
          <Position row={LONG} futurePrice={futurePrice} />
        </div>

        <div className="divider" />

        <div className="col-start full-width">
          <span>SHORT</span>
          <Position row={SHORT} futurePrice={futurePrice} />
        </div>
      </div>
    </Container>
  );
};

export default Perpetual;
