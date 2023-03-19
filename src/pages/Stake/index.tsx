import Input from '@/components/Input';
import Tabs from '@/components/Tabs';
import { SmartButton } from '@/components/_global';
import { TRADE_DIRECTION_ENUM, TRADE_TOKEN } from '@/configs/common';
import useLpDeposit from '@/hooks/lp/useLpDeposit';
import useLpTokenBalance from '@/hooks/lp/useLpTokenBalance';
import useLpWithdraw from '@/hooks/lp/useLpWithdraw';
import useExchangeFuturePrice from '@/hooks/perpetual/useExchangeFuturePrice';
import useExchangeTokenPrice from '@/hooks/useExchangeTokenPrice';
import useInputChange from '@/hooks/useInputChange';
import { recoilExchangeFuturePrice, recoilExchangeTokenPrice, recoilPoolBalances } from '@/models/_global';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { useEffect, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { styled } from 'styled-components';
import { useAccount } from 'wagmi';

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
  .divider {
    height: 1px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    margin: 20px 0;
  }
`;

// const units = [
//   {

//   }
// ]

const tabs = [
  { name: TRADE_DIRECTION_ENUM.DEPOSIT, key: TRADE_DIRECTION_ENUM.DEPOSIT },
  { name: TRADE_DIRECTION_ENUM.WITHDRAW, key: TRADE_DIRECTION_ENUM.WITHDRAW },
];

const Stake = () => {
  const [curDirection, handleChangeTab] = useInputChange({ defaultValue: TRADE_DIRECTION_ENUM.DEPOSIT });
  const [payAmount, handleAmountChange] = useInputChange({});
  const { tokenPrice } = useRecoilValue(recoilExchangeTokenPrice);
  const { futurePrice } = useRecoilValue(recoilExchangeFuturePrice);
  const { address } = useAccount();

  const { userPoolBalance, totalPoolBalance, totalPoolWETHBalance, totalPoolUSDCBalance } =
    useRecoilValue(recoilPoolBalances);
  const { run: lpBalancesRun } = useLpTokenBalance();
  const { run: tokenPriceRun } = useExchangeTokenPrice();
  const { run: futurePriceRun } = useExchangeFuturePrice();
  useEffect(() => {
    if (address) {
      lpBalancesRun();
      tokenPriceRun();
      futurePriceRun();
    }
  }, [address]);

  const { run: depositRun, loading: depositLoading, data: depositData, error: depositError } = useLpDeposit();
  const { run: withdrawRun, loading: withdrawLoading, data: withdrawData, error: withdrawError } = useLpWithdraw();

  const handleDeposit = (inputToken: TRADE_TOKEN.USDC | TRADE_TOKEN.WETH) => {
    console.log('payAmount', inputToken, payAmount);
    depositRun(inputToken, payAmount);
  };
  const handleWithdraw = (inputToken: TRADE_TOKEN.USDC | TRADE_TOKEN.WETH) => {
    console.log('payAmount', inputToken, payAmount);
    withdrawRun(inputToken, payAmount);
  };

  const totalUserUsdcBalance = useMemo(
    () =>
      BigNumber(tokenPrice)
        .multipliedBy(userPoolBalance)
        .div(10 ** (6 + 6))
        .toFixed(2),
    [tokenPrice, userPoolBalance],
  );

  const totalUserWethBalance = useMemo(
    () =>
      BigNumber(tokenPrice)
        .multipliedBy(userPoolBalance)
        .div(futurePrice)
        .div(10 ** (6 + 6 - 2))
        .toFixed(2),
    [futurePrice, tokenPrice, userPoolBalance],
  );

  const totalPoolUsdcBalance = useMemo(() => ethers.utils.formatUnits(totalPoolUSDCBalance, 6), [totalPoolUSDCBalance]);
  const totalPoolWethBalance = useMemo(() => ethers.utils.formatUnits(totalPoolWETHBalance, 9), [totalPoolWETHBalance]);

  const maxWithdrawUsdcBalance = useMemo(
    () => BigNumber.min(totalPoolUsdcBalance, totalUserUsdcBalance).toString(),
    [totalPoolUsdcBalance, totalUserUsdcBalance],
  );
  const maxWithdrawWethBalance = useMemo(
    () => BigNumber.min(totalPoolWethBalance, totalUserWethBalance).toString(),
    [totalPoolWethBalance, totalUserWethBalance],
  );

  return (
    <Container className="full-width">
      <Tabs items={tabs} onChange={handleChangeTab} />

      <div className="col-center full-width gap">
        <div className="row-between full-width">
          <div>ETH PRICE</div>
          <div>{ethers.utils.formatUnits(futurePrice, 2)}</div>
        </div>

        <div className="row-between full-width">
          <div>TOKEN PRICE</div>
          <div className="row-between gap">{ethers.utils.formatUnits(tokenPrice, 6)}</div>
        </div>

        <div className="row-between full-width">
          <div>USER LP IN POOL</div>
          <div>
            {userPoolBalance ? ethers.utils.formatUnits(userPoolBalance, 6) : 0}Token ~ {totalUserWethBalance}E ~{' '}
            {totalUserUsdcBalance}U
          </div>
        </div>
        <div className="row-between full-width">
          <div>TOTAL LP IN POOL</div>
          <div>{totalPoolBalance ? ethers.utils.formatUnits(totalPoolBalance, 6) : 0}Token</div>
        </div>

        <div className="row-between full-width">
          <div>TOTAL USDC IN POOL</div>
          <div>{totalPoolUsdcBalance}</div>
        </div>

        <div className="row-between full-width">
          <div>TOTAL WETH IN POOL</div>
          <div>{totalPoolWethBalance}</div>
        </div>

        <div className="divider" />

        <div className="row-between full-width">
          <div>MAX AVAILABLE</div>
          <div>
            {BigNumber(maxWithdrawUsdcBalance)
              .div(tokenPrice)
              .multipliedBy(10 ** 6)
              .toFixed(6)}
            T({maxWithdrawUsdcBalance}U) |{' '}
            {BigNumber(maxWithdrawWethBalance)
              .multipliedBy(futurePrice)
              .div(tokenPrice)
              .multipliedBy(10 ** (6 - 2))
              .toFixed(6)}
            T ({maxWithdrawWethBalance}E)
          </div>
        </div>

        <div className="col-center gap full-width">
          <Input
            suffix={curDirection === TRADE_DIRECTION_ENUM.WITHDRAW ? 'Token' : ''}
            className="full-width"
            value={payAmount}
            onChange={handleAmountChange}
          />
          <div className="row-between full-width gap">
            {curDirection === TRADE_DIRECTION_ENUM.WITHDRAW ? (
              <>
                <SmartButton loading={withdrawLoading} onClick={() => handleWithdraw(TRADE_TOKEN.USDC)}>
                  Withdraw To {TRADE_TOKEN.USDC}
                </SmartButton>
                <SmartButton loading={withdrawLoading} onClick={() => handleWithdraw(TRADE_TOKEN.WETH)}>
                  Withdraw To {TRADE_TOKEN.WETH}
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
