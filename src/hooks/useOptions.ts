import { optionContract } from '@/configs/common';
import { recoilOptionEpochIds } from '@/models/_global';
import { multicall } from '@wagmi/core';
import BigNumber from 'bignumber.js';
import { useSetRecoilState } from 'recoil';

const useOptions = () => {
  const setIds = useSetRecoilState(recoilOptionEpochIds);

  const getActiveEpochId = async () => {
    const multicallRes = await multicall({
      contracts: [
        {
          ...optionContract,
          functionName: 'currentEpochId',
          args: [],
        },
      ],
    });

    const currentEpochId = multicallRes[0]?.toString();
    console.log('currentEpochId', currentEpochId);
    const prevEpochId = BigNumber.max(0, BigNumber(currentEpochId as string).minus(100)).toString();
    const len = BigNumber(currentEpochId as string)
      .minus(prevEpochId)
      .toString();
    const historicalEpochId = new Array(len).map((i, index) => BigNumber(prevEpochId).plus(index).toString());

    setIds({
      startEpochId: prevEpochId,
      endEpochId: currentEpochId,
      historicalEpochIds: historicalEpochId,
    });
    console.log('historicalEpochId', historicalEpochId);
  };

  return null;
};

export default useOptions;
