import { exchangeContract, TRADE_TOKEN } from '@/configs/common';
import { getSignatureAndPrice } from '@/services';
import { USDCAmount, WETHAmount } from '@/typings/_global';
import { prepareWriteContract, writeContract } from '@wagmi/core';
import { useRequest } from 'ahooks';
import { ethers } from 'ethers';
import useLpTokenBalance from './useLpTokenBalance';

// todo currencyType
const useLpWithdraw = () => {
  const { run: lpBalancesRun } = useLpTokenBalance();

  const handleDeposit = async (inputToken: TRADE_TOKEN.USDC | TRADE_TOKEN.WETH, args: USDCAmount | WETHAmount) => {
    // if (!args?.length) return new Error('Invalid Parameters');
    const decimal = inputToken === TRADE_TOKEN.USDC ? 6 : 6;
    const curTokenType = inputToken === TRADE_TOKEN.USDC ? 0 : 1;
    const inputValue = ethers.utils.parseUnits(args, decimal).toString();

    try {
      const signature = await getSignatureAndPrice();
      console.log('signature', signature);

      const params = [inputValue, curTokenType, signature?.prices, signature?.time, signature?.sign];

      console.log('params', params);
      const config = await prepareWriteContract({
        ...exchangeContract,
        functionName: 'lpWithdrawToken',
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

export default useLpWithdraw;
