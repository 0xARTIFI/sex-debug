import Input from '@/components/Input';
import Tabs from '@/components/Tabs';
import { SmartButton } from '@/components/_global';
import { TRADE_DIRECTION_ENUM, TRADE_TOKEN } from '@/configs/common';
import useInputChange from '@/hooks/useInputChange';
import useLpDeposit from '@/hooks/useLpDeposit';
import useTraderWithdraw from '@/hooks/useTraderWithdraw';
import { recoilBalances } from '@/models/_global';
import { ethers } from 'ethers';
import { useRecoilValue } from 'recoil';
import { styled } from 'styled-components';

const Container = styled.div`
  gap: 12px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  padding: 10px;
  .gap {
    gap: 12px;
  }
  .tab {
    margin-bottom: 18px;
  }
`;

const tabs = [
  { name: TRADE_DIRECTION_ENUM.DEPOSIT, key: TRADE_DIRECTION_ENUM.DEPOSIT },
  { name: TRADE_DIRECTION_ENUM.WITHDRAW, key: TRADE_DIRECTION_ENUM.WITHDRAW },
];

const Stake = () => {
  const [curDirection, handleChangeTab] = useInputChange({ defaultValue: TRADE_DIRECTION_ENUM.DEPOSIT });
  const [payAmount, handleAmountChange] = useInputChange({});
  const balances = useRecoilValue(recoilBalances);

  const { run: depositRun, loading: depositLoading, data: depositData, error: depositError } = useLpDeposit();
  const { run: withdrawRun, loading: withdrawLoading, data: withdrawData, error: withdrawError } = useTraderWithdraw();

  const handleDeposit = (inputToken: TRADE_TOKEN.USDC | TRADE_TOKEN.WETH) => {
    console.log('payAmount', inputToken, payAmount);
    depositRun(inputToken, payAmount);
  };
  const handleWithdraw = (inputToken: TRADE_TOKEN.USDC | TRADE_TOKEN.WETH) => {
    console.log('payAmount', inputToken, payAmount);
    withdrawRun(inputToken, payAmount);
  };

  return (
    <Container className="full-width">
      <Tabs items={tabs} onChange={handleChangeTab} />

      <div className="col-center full-width gap">
        <div className="row-between full-width">
          <div>WETH IN ACCOUNT</div>
          <div>{ethers.utils.formatEther(balances.WETH_IN_ACCOUNT)}</div>
        </div>
        <div className="row-between full-width">
          <div>USDC IN ACCOUNT</div>
          <div>{ethers.utils.formatUnits(balances.USDC_IN_ACCOUNT, 6)}</div>
        </div>
        <div className="row-between full-width">
          <div>WETH LP IN POOL</div>
          <div>{ethers.utils.formatEther(balances.WETH_IN_WALLET)}</div>
        </div>
        <div className="row-between full-width">
          <div>USDC LP IN POOL</div>
          <div>{ethers.utils.formatEther(balances.USDC_IN_WALLET)}</div>
        </div>

        <div className="col-center gap full-width">
          <Input className="full-width" value={payAmount} onChange={handleAmountChange} />
          <div className="row-between full-width gap">
            {curDirection === TRADE_DIRECTION_ENUM.WITHDRAW ? (
              <>
                <SmartButton loading={withdrawLoading} onClick={() => handleWithdraw(TRADE_TOKEN.USDC)}>
                  Withdraw {TRADE_TOKEN.USDC}
                </SmartButton>
                <SmartButton loading={withdrawLoading} onClick={() => handleWithdraw(TRADE_TOKEN.WETH)}>
                  Withdraw {TRADE_TOKEN.WETH}
                </SmartButton>
              </>
            ) : (
              <>
                <SmartButton loading={depositLoading} onClick={() => handleDeposit(TRADE_TOKEN.USDC)}>
                  Deposit {TRADE_TOKEN.USDC}
                </SmartButton>
                <SmartButton loading={depositLoading} onClick={() => handleDeposit(TRADE_TOKEN.WETH)}>
                  Deposit {TRADE_TOKEN.WETH}
                </SmartButton>
              </>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Stake;
