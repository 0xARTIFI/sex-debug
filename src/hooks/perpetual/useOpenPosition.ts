import { exchangeContract, TRADE_DIRECTION_ENUM } from '@/configs/common';
import { prepareWriteContract, writeContract } from '@wagmi/core';
import { useRequest } from 'ahooks';
import { ethers } from 'ethers';
import useBalances from '../useBalances';
import useFetchPerpetualPositions from './useFetchPerpetualPositions';

const useOpenPosition = () => {
  const { run: balancesRun } = useBalances();
  const { run: positionRun } = useFetchPerpetualPositions();

  const openPosition = async (
    direction: TRADE_DIRECTION_ENUM.LONG | TRADE_DIRECTION_ENUM.SHORT,
    input: string,
    leverage: string | number,
  ) => {
    const currentFunction = direction === TRADE_DIRECTION_ENUM.SHORT ? 'traderOpenShortOrder' : 'traderOpenLongOrder';
    const decimal = direction === TRADE_DIRECTION_ENUM.SHORT ? 6 : 9;

    const marginAmount = ethers.utils.parseUnits(input, decimal).toString();

    console.log('marginAmount, leverage', marginAmount, leverage, currentFunction);

    try {
      const config = await prepareWriteContract({
        ...exchangeContract,
        functionName: currentFunction,
        args: [marginAmount, leverage],
      });
      console.log('config', config);
      const tx = await writeContract(config);
      const res = await tx.wait();
      balancesRun();
      positionRun();
      return res;
    } catch (e: any) {
      console.log('e', e?.message);
      throw Error(e);
    }
  };

  const props = useRequest(openPosition, {
    manual: true,
  });

  return props;
};

export default useOpenPosition;
