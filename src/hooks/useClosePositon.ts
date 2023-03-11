/* eslint-disable @iceworks/best-practices/recommend-polyfill */
import { exchangeContract, TRADE_DIRECTION_ENUM } from '@/configs/common';
import { prepareWriteContract, writeContract } from '@wagmi/core';
import { useRequest } from 'ahooks';
import BigNumber from 'bignumber.js';
import useFetchPositions from './useFetchPositions';

// traderCloseLongOrder
// traderCloseShortOrder

const useClosePositon = () => {
  const { run: fetchPositions } = useFetchPositions();

  const closePosition = async (direction: TRADE_DIRECTION_ENUM, tokenAmount: number, entreyPrice: number) => {
    if (!tokenAmount) throw new Error('Invalid Amount');

    let tokenAmountSize: BigNumber | number | string = BigNumber(0);
    if (direction === TRADE_DIRECTION_ENUM.SHORT) {
      tokenAmountSize = BigNumber(tokenAmount)
        // .div(entreyPrice)
        .multipliedBy(10000);
    } else {
      // temp: 无法全部平仓时，临时精度补足
      // todo 检查前值精度是否缺失
      // tokenAmountSize = BigNumber(tokenAmount).multipliedBy(entreyPrice).multipliedBy(100);

      tokenAmountSize = BigNumber(tokenAmount)
        // .div(entreyPrice)
        .multipliedBy(10000);
    }

    tokenAmountSize = tokenAmountSize.isInteger()
      ? tokenAmountSize.toString()
      : BigNumber(tokenAmountSize.toFixed(0)).toString();

    const closeTokenAmount = [tokenAmountSize];
    console.log('平仓参数：', closeTokenAmount);

    try {
      const config = await prepareWriteContract({
        ...exchangeContract,
        functionName: direction === TRADE_DIRECTION_ENUM.SHORT ? 'traderCloseShortOrder' : 'traderCloseLongOrder',
        args: [...closeTokenAmount],
      });
      console.log('config', config);
      const tx = await writeContract(config);
      const res = await tx.wait();
      fetchPositions();
      return res;
    } catch (e: any) {
      console.log('e', e?.message);
      throw Error(e);
    }
  };

  const { run, loading } = useRequest(closePosition, {
    manual: true,
  });

  return { run, loading };
};

export default useClosePositon;
