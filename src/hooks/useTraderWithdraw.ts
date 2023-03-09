import { exchangeContract, TRADE_TOKEN } from '@/configs/common';
import { USDCAmount, WETHAmount } from '@/typings/_global';
import { prepareWriteContract, writeContract } from '@wagmi/core';
import { useRequest } from 'ahooks';
import useApprove from './useApprove';

const useTraderWithdraw = () => {
  const { run: approveRun } = useApprove();

  const handleWithdraw = async (
    inputToken: TRADE_TOKEN.USDC | TRADE_TOKEN.WETH,
    args: Array<USDCAmount | WETHAmount>,
  ) => {
    if (!args?.length) return new Error('Invalid Parameters');
    try {
      const config = await prepareWriteContract({
        ...exchangeContract,
        functionName: inputToken === TRADE_TOKEN.USDC ? 'traderWithdrawUSDT' : 'traderWithdrawWETH',
        args,
      });
      const tx = await writeContract(config);
      const res = await tx.wait();
      return res;
    } catch (e: any) {
      console.log('e', e?.message);
      return e?.message;
    }
  };

  const { run, loading, data, error } = useRequest(handleWithdraw, {
    manual: true,
  });
  return { run, loading, data, error };
};

export default useTraderWithdraw;
