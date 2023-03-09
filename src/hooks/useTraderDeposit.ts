import { exchangeContract, TRADE_TOKEN } from '@/configs/common';
import { USDCAmount, WETHAmount } from '@/typings/_global';
import { prepareWriteContract, writeContract } from '@wagmi/core';
import { useRequest } from 'ahooks';
import { ethers } from 'ethers';
import useApprove from './useApprove';
import useBalances from './useBalances';

const useTraderDeposit = () => {
  const { handleApprove: approveRun } = useApprove();

  const { run: runBalance } = useBalances();

  const handleDeposit = async (inputToken: TRADE_TOKEN.USDC | TRADE_TOKEN.WETH, args: USDCAmount | WETHAmount) => {
    // if (!args?.length) return new Error('Invalid Parameters');
    const decimal = inputToken === TRADE_TOKEN.USDC ? 6 : 18;
    const inputValue = ethers.utils.parseUnits(args, decimal).toString();

    try {
      // 检查allowance
      await approveRun(inputToken, exchangeContract.address, inputValue);

      const config = await prepareWriteContract({
        ...exchangeContract,
        functionName: inputToken === TRADE_TOKEN.USDC ? 'traderDepositUSDC' : 'traderDepositWETH',
        args: [inputValue],
      });
      const tx = await writeContract(config);
      const res = await tx.wait();
      runBalance();
      return res;
    } catch (e: any) {
      console.log('e', e?.message);
      return e?.message;
    }
  };

  const { run, loading, data, error } = useRequest(handleDeposit, {
    manual: true,
  });
  return { run, loading, data, error };
};

export default useTraderDeposit;
