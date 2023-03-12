import { optionContract } from '@/configs/common';
import { multicall } from '@wagmi/core';
import { useRequest } from 'ahooks';

const useFetchOptionPositions = () => {
  const fetchPosition = async (startEpoch: number | string, endEpoch: number | string) => {
    console.log('startEpoch', startEpoch, endEpoch);
    const multicallRes = await multicall({
      contracts: [
        {
          ...optionContract,
          functionName: 'getUserOptionData',
          args: [startEpoch, endEpoch],
        },
      ],
    });

    console.log('multicallRes', multicallRes);
  };

  const props = useRequest(fetchPosition, { manual: true });
  return props;
};
export default useFetchOptionPositions;
