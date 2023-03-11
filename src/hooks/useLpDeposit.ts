import { exchangeContract, TRADE_TOKEN } from '@/configs/common';
import { getSignatureAndPrice } from '@/server';
import { USDCAmount, WETHAmount } from '@/typings/_global';
import { prepareWriteContract, writeContract } from '@wagmi/core';
import { useRequest } from 'ahooks';
import { ethers } from 'ethers';
import useApprove from './useApprove';
import useLpTokenBalance from './useLpTokenBalance';

const useLpDeposit = () => {
  const { run: approveRun } = useApprove();
  const { run: lpBalancesRun } = useLpTokenBalance();

  const handleDeposit = async (inputToken: TRADE_TOKEN.USDC | TRADE_TOKEN.WETH, args: USDCAmount | WETHAmount) => {
    // if (!args?.length) return new Error('Invalid Parameters');
    const decimal = inputToken === TRADE_TOKEN.USDC ? 6 : 9;
    const inputValue = ethers.utils.parseUnits(args, decimal).toString();

    try {
      // 检查allowance
      await approveRun(inputToken, exchangeContract.address, inputValue);

      const signature = await getSignatureAndPrice();
      console.log('signature', signature);

      const params = [inputValue, signature?.prices, signature?.time, signature?.sign];

      const config = await prepareWriteContract({
        ...exchangeContract,
        functionName: inputToken === TRADE_TOKEN.USDC ? 'lpDepositUSDC' : 'lpDepositWETH',
        args: params,
      });
      const tx = await writeContract(config);
      const res = await tx.wait();
      lpBalancesRun();
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

export default useLpDeposit;
