import { optionContract } from '@/configs/common';
import {
  recoilAllOptionPositions,
  recoilSettledOptionPositions,
  recoilUnsettledOptionPositions,
} from '@/models/_global';
import { OptionPositionItem } from '@/typings/_global';
import { readContract } from '@wagmi/core';
import { useRequest } from 'ahooks';
import BigNumber from 'bignumber.js';
import { useSetRecoilState } from 'recoil';
import useAuth from '../useAuth';

const useFetchOptionPositions = () => {
  const setOptionPosition = useSetRecoilState(recoilAllOptionPositions);
  const setSettledOptionPositions = useSetRecoilState(recoilSettledOptionPositions);
  const setUnsettledOptionPositions = useSetRecoilState(recoilUnsettledOptionPositions);

  const { address } = useAuth(true);
  const fetchPosition = async ({ from, to }: { from?: number | string; to: number | string }) => {
    console.log('startEpoch', BigNumber.max(0, BigNumber(to).minus(35)).toNumber(), to);

    try {
      const res: any = await readContract({
        ...optionContract,
        functionName: 'getUserOptionData',
        args: [BigNumber.max(0, BigNumber(to).minus(35)).toNumber(), BigNumber(to).toNumber()],
        overrides: { from: address },
      });

      if (!res?.length) throw Error('Invalid');

      const positionLength = res[4].toString();

      const position: OptionPositionItem[] = [];
      for (let i = 0; i < positionLength; i++) {
        const epochId = res[0][i]?.toString();
        const productId = res[1][i]?.toString();
        const res2 = {
          isCall: res[2][i]?.isCall,
          strikePrice: res[2][i]?.strikePrice?.toString(),
        };
        const res3 = {
          isSettle: !!res[3][i]?.isSettle,
          totalCost: res[3][i]?.totalCost?.toString(),
          totalCostOrigin: res[3][i]?.totalCost,
          totalSize: res[3][i]?.totalSize?.toString(),
        };
        position.push({
          epochId,
          productId,
          ...res2,
          ...res3,
        });
      }

      console.table(position);
      setOptionPosition(position);
      setSettledOptionPositions(position.filter((i) => i?.isSettle));
      setUnsettledOptionPositions(position.filter((i) => !i?.isSettle));
      return position;
    } catch (e) {
      console.log('e,', e);
      return null;
    }
  };

  const props = useRequest(fetchPosition, { manual: true });
  return props;
};
export default useFetchOptionPositions;
