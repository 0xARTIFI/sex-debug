import { message } from '@/components';
import { LeverageLongContaact, LeverageShortContract, TRADE_DIRECTION_ENUM } from '@/configs/common';
import { prepareWriteContract, writeContract } from '@wagmi/core';
import { useRequest } from 'ahooks';
import { ethers } from 'ethers';
import { useEffect } from 'react';
import useAuth from '../useAuth';
import useFetchPerpetualPositions from './useFetchPerpetualPositions';

const useAdjustMargin = () => {
  const { address } = useAuth(true);
  const { run: fetchPositions } = useFetchPerpetualPositions();

  // marginAmount为调整的保证金的数量，永远 >= 0，inc为是增是减, true=增, false=减
  const adjustMargin = async (direction: TRADE_DIRECTION_ENUM, marginAmount: any, indexPrice: any) => {
    if (!marginAmount || !indexPrice) return null;
    const _amount = ethers.utils.parseUnits(marginAmount, direction === TRADE_DIRECTION_ENUM.SHORT ? 6 : 9);
    const params = [_amount, indexPrice, address];
    const curDirContract = direction === TRADE_DIRECTION_ENUM.SHORT ? LeverageShortContract : LeverageLongContaact;

    console.log('调整保证金参数', params);

    try {
      const config = await prepareWriteContract({
        ...curDirContract,
        functionName: 'userAdjustMarginAmount',
        args: [...params],
      });
      console.log('config', config);
      const tx = await writeContract(config);
      const res = await tx.wait();
      fetchPositions();
      return res;
    } catch (e: any) {
      console.log('e', e?.message);
      throw Error(e?.message);
    }
  };

  const {
    loading: adjustMarginLoading,
    run: adjustMarginRun,
    data: adjustMarginData,
    error: adjustMarginError,
  } = useRequest(adjustMargin, { manual: true });

  useEffect(() => {
    if (adjustMarginData) {
      message.success('Success');
    }
  }, [adjustMarginData]);

  useEffect(() => {
    if (adjustMarginError) {
      message.error(adjustMarginError?.message);
    }
  }, [adjustMarginError]);

  return {
    loading: adjustMarginLoading,
    run: adjustMarginRun,
    data: adjustMarginData,
  };
};

export default useAdjustMargin;
