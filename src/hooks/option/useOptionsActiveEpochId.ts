import { optionContract } from '@/configs/common';
import { recoilOptionEpochIds } from '@/models/_global';
import { multicall } from '@wagmi/core';
import { useRequest } from 'ahooks';
import BigNumber from 'bignumber.js';
import { useSetRecoilState } from 'recoil';

const useOptionsActiveEpochId = () => {
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
    const prevEpochId = BigNumber.max(0, BigNumber(currentEpochId as string).minus(100)).toString();
    const len = BigNumber(currentEpochId as string)
      .minus(prevEpochId)
      .toNumber();
    const historicalEpochId = new Array(len).fill('0').map((i, index) => BigNumber(prevEpochId).plus(index).toString());

    historicalEpochId.push(currentEpochId);

    setIds({
      startEpochId: prevEpochId,
      endEpochId: currentEpochId,
      historicalEpochIds: historicalEpochId,
    });
  };

  const props = useRequest(getActiveEpochId, { manual: true });

  return props;
};

export default useOptionsActiveEpochId;
