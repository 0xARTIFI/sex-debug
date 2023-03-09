import Input from '@/components/Input';
import Tabs from '@/components/Tabs';
import { SmartButton } from '@/components/_global';
import { TRADE_DIRECTION_ENUM } from '@/configs/common';
import useInputChange from '@/hooks/useInputChange';
import useOpenPosition from '@/hooks/useOpenPosition';
import BigNumber from 'bignumber.js';
import { styled } from 'styled-components';

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
`;

const perpetualTab = [
  { name: TRADE_DIRECTION_ENUM.LONG, key: TRADE_DIRECTION_ENUM.LONG },
  { name: TRADE_DIRECTION_ENUM.SHORT, key: TRADE_DIRECTION_ENUM.SHORT },
];

const Perpetual = () => {
  const [curDirection, handleChangeTab] = useInputChange({ defaultValue: TRADE_DIRECTION_ENUM.LONG });
  const [payAmount, handleAmountChange] = useInputChange({});
  const [leverage, handleLeverageChange] = useInputChange({ defaultValue: 1 });

  const { run } = useOpenPosition();
  const handleConfirm = () => {
    run(curDirection, payAmount, leverage);
  };
  return (
    <Container className="full-width row-between gap">
      <div className="full-width bp">
        <Tabs items={perpetualTab} onChange={handleChangeTab} />

        <div className="col-center">
          <div className="row-between">
            <span>Pay</span>
            <Input value={payAmount} onChange={handleAmountChange} />
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
      <div className="full-width bp">Postions</div>
    </Container>
  );
};

export default Perpetual;
